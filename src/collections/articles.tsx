import { buildCollection } from "@firecms/core";
import { RichTextEditor } from '../components/RichTextEditor';

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
            Field: ({ value, setValue }) => (
                <RichTextEditor 
                    value={value as string} 
                    setValue={setValue}
                />
            )
        },
        category: {
            name: "分类",
            validation: { required: true },
            dataType: "string",
            enumValues: {
                saturday: "Saturday Program",
                afterSchool: "After-school Program",
                summerCamp: "Summer Camp Program",
                satAct: "Online SAT/ACT Training",
                news: "新闻动态",
                notice: "通知公告"
            }
        },
        publishDate: {
            name: "发布日期",
            dataType: "date",
            validation: { 
                required: true,  // 添加必选验证
                requiredMessage: "请选择发布日期"  // 自定义错误提示
            },
            description: "文章的发布日期"  // 添加字段说明
        },
        status: {
            name: "状态",
            dataType: "string",
            validation: {
                required: true,  // 添加必选验证
                requiredMessage: "请选择文章状态"  // 自定义错误提示
            },
            description: "文章的发布状态",  // 添加字段说明
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