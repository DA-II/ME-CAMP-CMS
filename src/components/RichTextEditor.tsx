import React, { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
    value: string;
    setValue: (value: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, setValue }) => {
    const quillRef = useRef<ReactQuill>(null);  // 添加 ref

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ]
        },
        clipboard: {
            matchVisual: false
        },
        keyboard: {
            bindings: {}
        }
    }), []);

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
            />
        </div>
    );
};

export default RichTextEditor; 