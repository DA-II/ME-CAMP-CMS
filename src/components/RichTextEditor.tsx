import React, { useMemo, useRef, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

interface RichTextEditorProps {
    value: string;
    setValue: (value: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, setValue }) => {
    const quillRef = useRef<ReactQuill>(null);
    const storage = getStorage();

    // 插入临时占位图
    const insertPlaceholder = (editor: any, range: any) => {
        const placeholder = `
            <div class="image-uploading" style="padding: 50px; text-align: center; background: #f8f9fa; margin: 10px 0;">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="animation: spin 1s linear infinite;">
                    <path d="M12 4V2M12 22v-2M6.34 6.34L4.93 4.93M19.07 19.07l-1.41-1.41M4 12H2M22 12h-2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <div style="margin-top: 8px;">正在上传图片...</div>
                <div class="upload-progress" style="margin-top: 8px;">0%</div>
            </div>
        `;
        editor.clipboard.dangerouslyPasteHTML(range.index, placeholder);
        return range.index;
    };

    // 处理图片上传
    const handleImageUpload = async (file: File, editor: any, range: any) => {
        const placeholderIndex = insertPlaceholder(editor, range);
        const fileName = `articles/images/${uuidv4()}_${file.name}`;
        const storageRef = ref(storage, fileName);

        // 创建上传任务
        const uploadTask = uploadBytesResumable(storageRef, file);

        // 监听上传进度
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                const progressElement = editor.container.querySelector('.upload-progress');
                if (progressElement) {
                    progressElement.textContent = `${progress}%`;
                }
            },
            (error) => {
                console.error('Error uploading image:', error);
                alert('图片上传失败，请重试');
                // 移除占位符
                editor.deleteText(placeholderIndex, 1);
            },
            async () => {
                try {
                    const url = await getDownloadURL(storageRef);
                    // 移除占位符
                    editor.deleteText(placeholderIndex, 1);
                    // 插入实际图片
                    editor.insertEmbed(placeholderIndex, 'image', url);
                } catch (error) {
                    console.error('Error getting download URL:', error);
                    alert('图片处理失败，请重试');
                    editor.deleteText(placeholderIndex, 1);
                }
            }
        );
    };

    // 处理粘贴事件
    const handlePaste = useCallback(async (e: ClipboardEvent) => {
        const clipboardData = e.clipboardData;
        if (!clipboardData) return;

        const hasImage = Array.from(clipboardData.items).some(
            item => item.type.indexOf('image') !== -1
        );

        if (hasImage) {
            e.preventDefault();
            
            for (let i = 0; i < clipboardData.items.length; i++) {
                const item = clipboardData.items[i];
                if (item.type.indexOf('image') !== -1) {
                    const file = item.getAsFile();
                    if (file) {
                        const editor = quillRef.current?.getEditor();
                        const range = editor?.getSelection(true);
                        if (editor && range) {
                            await handleImageUpload(file, editor, range);
                        }
                    }
                }
            }
        }
    }, [storage]);

    // 图片上传处理器
    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
                const editor = quillRef.current?.getEditor();
                const range = editor?.getSelection(true);
                if (editor && range) {
                    await handleImageUpload(file, editor, range);
                }
            }
        };
    }, [storage]);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        },
        clipboard: {
            matchVisual: false
        },
        keyboard: {
            bindings: {}
        }
    }), [imageHandler]);

    const formats = useMemo(() => [
        'header',
        'bold', 'italic', 'underline',
        'list', 'bullet',
        'link', 'image'
    ], []);

    const handleChange = (content: string) => {
        setValue(content);
    };

    return (
        <>
            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}
            </style>
            <div style={{ height: '450px' }}>
                <ReactQuill 
                    ref={quillRef}
                    theme="snow"
                    value={value}
                    onChange={handleChange}
                    modules={modules}
                    formats={formats}
                    style={{ 
                        height: '400px',
                        marginBottom: '50px'
                    }}
                    preserveWhitespace
                    onPaste={handlePaste}
                />
            </div>
        </>
    );
};

export default RichTextEditor; 