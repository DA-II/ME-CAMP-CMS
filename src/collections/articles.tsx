import { buildCollection } from "@firecms/core";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';  // 引入样式
import { useMemo } from 'react';  // 添加 useMemo

type Article = {
    title: string;
    titleEn: string;  // 新增英文标题
    cover: string;    // 新增封面
    content: string;
    category: string;
    publishDate: Date;
    status: string;
    showOnHome: boolean;  // 新增首页展示控制字段
}

export const articlesCollection = buildCollection<Article>({
    name: "文章管理",
    path: "articles",
    id: "articles",
    properties: {
        title: {
            name: "标题",
            validation: { required: true },
            dataType: "string"
        },
        titleEn: {
            name: "英文标题",
            validation: { required: true },
            dataType: "string"
        },
        cover: {
            name: "封面图片",
            dataType: "string",
            storage: {
                storagePath: "articles/covers",
                acceptedFiles: ["image/*"],
                metadata: {
                    cacheControl: "public,max-age=86400"
                },
                storeUrl: true
            }
        },
        content: {
            name: "内容",
            validation: { required: true },
            dataType: "string",
            Field: ({ value, setValue }) => {
                // 使用 useMemo 缓存 modules 配置
                const modules = useMemo(() => ({
                    toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                    ],
                    clipboard: {
                        matchVisual: false // 禁用粘贴格式匹配
                    }
                }), []);

                // 使用 useMemo 缓存 formats 配置
                const formats = useMemo(() => [
                    'header',
                    'bold', 'italic', 'underline',
                    'list', 'bullet',
                    'link', 'image'
                ], []);

                // 处理 onChange 事件
                const handleChange = (content: string) => {
                    setValue(content);
                };

                return (
                    <div style={{ height: '450px' }}>
                        <ReactQuill 
                            theme="snow"
                            value={value as string}
                            onChange={handleChange}
                            modules={modules}
                            formats={formats}
                            style={{ 
                                height: '400px',
                                marginBottom: '50px'
                            }}
                            preserveWhitespace={true}
                        />
                    </div>
                );
            }
        },
        category: {
            name: "分类",
            validation: { required: true },
            dataType: "string",
            enumValues: {
                news: "新闻动态",
                notice: "通知公告",
                study: "学习资料"
            }
        },
        publishDate: {
            name: "发布日期",
            dataType: "date"
        },
        status: {
            name: "状态",
            dataType: "string",
            enumValues: {
                draft: "草稿",
                published: "已发布",
                archived: "已归档"
            }
        },
        showOnHome: {
            name: "首页展示",
            description: "是否在首页显示此文章",
            dataType: "boolean",
            defaultValue: false,  // 默认不在首页显示
            columnWidth: 120
        }
    }
}); 