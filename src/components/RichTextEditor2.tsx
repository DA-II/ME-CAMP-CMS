import React from 'react';
import RichTextEditor, { BaseKit, Bold, Italic, Underline, Strike, Code, 
    Heading, BulletList, OrderedList, TextAlign, Link, Image, History, 
    Clear, FontFamily, FontSize, Color, Highlight, Table,
    HorizontalRule } from 'reactjs-tiptap-editor';
import 'reactjs-tiptap-editor/style.css';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { useModeController } from "@firecms/core";

interface EditorProps {
    value: string;
    setValue: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ value, setValue }) => {
    const storage = getStorage();
    const modeController = useModeController();
    const isDarkMode = modeController.mode === "dark";

    const handleImageUpload = async (file: File): Promise<string> => {
        const fileName = `articles/images/${uuidv4()}_${file.name}`;
        const storageRef = ref(storage, fileName);
        
        await uploadBytesResumable(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return url;
    };

    const extensions = [
        BaseKit.configure({
            placeholder: {
                placeholder: '请输入内容...',
                showOnlyCurrent: true,
            },
            characterCount: {
                limit: 50000,
            }
        }),
        Bold,
        Italic,
        Underline,
        Strike,
        Code,
        Heading.configure({
            levels: [1, 2, 3]
        }),
        BulletList,
        OrderedList,
        TextAlign.configure({
            types: ['heading', 'paragraph']
        }),
        Link,
        Image.configure({
            upload: handleImageUpload,
        }),
        History,
        Clear,
        FontFamily,
        FontSize,
        Color,
        Highlight,
        Table,
        HorizontalRule
    ];

    return (
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.375rem' }}>
            <RichTextEditor
                output='html'
                content={value}
                onChangeContent={setValue}
                extensions={extensions}
                dark={isDarkMode}
                minHeight="400px"
                contentClass="prose max-w-none"
                toolbar={{
                    items: [
                        ['history'],
                        ['clear'],
                        ['fontFamily', 'fontSize'],
                        ['heading'],
                        ['bold', 'italic', 'underline', 'strike'],
                        ['color', 'highlight'],
                        ['bulletList', 'orderedList'],
                        ['textAlign'],
                        ['link', 'image', 'code'],
                        ['table'],
                        ['horizontalRule'],
                    ]
                }}
                editorProps={{
                    handlePaste: true,
                    handleDrop: true,
                    handleKeyDown: true
                }}
            />
        </div>
    );
};

export default Editor; 