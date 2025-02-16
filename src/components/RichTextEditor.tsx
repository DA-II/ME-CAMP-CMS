import React, { useMemo, useRef, useCallback, useState } from 'react';
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
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // 插入临时占位图
    const insertPlaceholder = (editor: any, range: any) => {
        const placeholder = `
            <div class="image-uploading" style="padding: 50px; text-align: center; background: #f8f9fa; margin: 10px 0;">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="animation: spin 1s linear infinite;">
                    <path d="M12 4V2M12 22v-2M6.34 6.34L4.93 4.93M19.07 19.07l-1.41-1.41M4 12H2M22 12h-2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                
            </div>
        `;
        editor.clipboard.dangerouslyPasteHTML(range.index, placeholder);
        return range.index;
    };

    // 处理图片上传
    const handleImageUpload = async (file: File, editor: any, range: any) => {
        setIsUploading(true);
        setUploadProgress(0);
        
        const placeholderIndex = insertPlaceholder(editor, range);
        const fileName = `articles/images/${uuidv4()}_${file.name}`;
        const storageRef = ref(storage, fileName);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setUploadProgress(progress);
                const progressElement = editor.container.querySelector('.upload-progress');
                if (progressElement) {
                    progressElement.textContent = `${progress}%`;
                }
            },
            (error) => {
                console.error('Error uploading image:', error);
                alert('图片上传失败，请重试');
                editor.deleteText(placeholderIndex, 1);
                setIsUploading(false);
            },
            async () => {
                try {
                    const url = await getDownloadURL(storageRef);
                    editor.deleteText(placeholderIndex, 1);
                    editor.insertEmbed(placeholderIndex, 'image', url);
                } catch (error) {
                    console.error('Error getting download URL:', error);
                    alert('图片处理失败，请重试');
                    editor.deleteText(placeholderIndex, 1);
                } finally {
                    setIsUploading(false);
                    setUploadProgress(0);
                }
            }
        );
    };

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
            matchVisual: false,
            matchers: [
                ['img', () => ({ insert: '' })],
            ]
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
                    .uploading-overlay {
                        position: absolute;
                        top: 0;
                        right: 0;
                        padding: 8px 16px;
                        background: rgba(79, 70, 229, 0.9);
                        color: white;
                        border-radius: 0 0 0 8px;
                        z-index: 1000;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .progress-text {
                        font-size: 14px;
                        font-weight: 500;
                    }
                    .editor-container {
                        position: relative;
                    }
                    .ql-editor.disabled {
                        background: rgba(0, 0, 0, 0.03);
                        cursor: not-allowed;
                    }
                `}
            </style>
            <div className="editor-container" style={{ height: '450px' }}>
                {isUploading && (
                    <div className="uploading-overlay">
                        <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24">
                            <path 
                                d="M12 4V2M12 22v-2M6.34 6.34L4.93 4.93M19.07 19.07l-1.41-1.41M4 12H2M22 12h-2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="progress-text">
                            正在上传图片 {uploadProgress}%
                        </span>
                    </div>
                )}
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
                    readOnly={isUploading}
                    className={isUploading ? 'disabled' : ''}
                />
            </div>
        </>
    );
};

export default RichTextEditor; 