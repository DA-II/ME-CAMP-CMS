import React, { useCallback, useState } from 'react';
import { useModeController } from "@firecms/core";
import RichTextEditor, {
    BaseKit,
    Blockquote,
    Bold,
    BulletList,
    Clear,
    Code,
    CodeBlock,
    Color,
    ColumnActionButton,
    Emoji,
    ExportPdf,
    ExportWord,
    FontFamily,
    FontSize,
    FormatPainter,
    Heading,
    Highlight,
    History,
    HorizontalRule,
    Iframe,
    Image,
    ImportWord,
    Indent,
    Italic,
    Katex,
    LineHeight,
    Link,
    MoreMark,
    OrderedList,
    SearchAndReplace,
    SlashCommand,
    Strike,
    Table,
    TaskList,
    TextAlign,
    Underline,
    locale
} from 'reactjs-tiptap-editor';
import 'reactjs-tiptap-editor/style.css';
import 'katex/dist/katex.min.css';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

interface EditorProps {
    value: string;
    setValue: (value: string) => void;
    editable?: boolean;
}

const Editor: React.FC<EditorProps> = ({ 
    value, 
    setValue, 
    editable = true
}) => {
    const storage = getStorage();
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const modeController = useModeController();
    const isDark = modeController.mode === "dark";

    const handleImageUpload = async (file: File): Promise<string> => {
        setLoading(true);
        setUploadProgress(0);
        try {
            const fileName = `articles/images/${uuidv4()}_${file.name}`;
            const storageRef = ref(storage, fileName);
            
            const uploadTask = uploadBytesResumable(storageRef, file);
            
            uploadTask.on('state_changed', 
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setUploadProgress(progress);
                }
            );

            await uploadTask;
            const url = await getDownloadURL(storageRef);
            return url;
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const extensions = [
        BaseKit.configure({
            multiColumn: true,
            placeholder: {
                placeholder: '请输入内容...',
                showOnlyCurrent: true,
            },
            characterCount: {
                limit: 50000,
            },
        }),
        History,
        SearchAndReplace,
        FormatPainter,
        Clear,
        FontFamily,
        Heading,
        FontSize,
        Bold,
        Italic,
        Underline,
        Strike,
        MoreMark,
        Katex,
        Emoji,
        Color,
        Highlight,
        BulletList,
        OrderedList,
        TextAlign.configure({ 
            types: ['heading', 'paragraph']
        }),
        LineHeight,
        TaskList.configure({
            taskItem: {
                nested: true,
            },
        }),
        Link,
        Image.configure({
            upload: handleImageUpload
        }),
        Blockquote,
        SlashCommand,
        HorizontalRule,
        Code.configure({
            toolbar: false,
        }),
        CodeBlock.configure({ 
            defaultTheme: isDark ? 'dracula' : 'github-light'
        }),
        ColumnActionButton,
        Table,
        ExportPdf
    ];

    return (
        <div className={`editor-container ${loading ? 'loading' : ''}`}>
            <style>
                {`
                    .editor-container {
                        position: relative;
                        border-radius: 0.55rem;
                        overflow: hidden;
                    }
                    .upload-overlay {
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
                        font-size: 14px;
                    }
                    .loading-spinner {
                        width: 16px;
                        height: 16px;
                        border: 2px solid white;
                        border-top-color: transparent;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .editor-container.loading::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: ${isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.7)'};
                    }
                    .richtext-bg-background {
                        background-color: ${isDark ? 'rgb(35,35,42)' : 'rgb(240,243,247)'};
                    }
                    .prose {
                        max-width: none;
                        color: ${isDark ? '#e5e7eb' : 'inherit'};
                    }
                    .prose img {
                        margin: 0 auto;
                    }
                `}
            </style>
            {loading && (
                <div className="upload-overlay">
                    <div className="loading-spinner" />
                    <span>正在上传图片 {uploadProgress}%</span>
                </div>
            )}
            <RichTextEditor
                output='html'
                content={value}
                onChangeContent={setValue}
                extensions={extensions}
                dark={isDark}
                minHeight={editable ? "600px" : "auto"}
                contentClass="prose"
            />
        </div>
    );
};

export default Editor; 