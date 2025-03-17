import { buildCollection } from "@firecms/core";
import Editor from '../components/RichTextEditor';

type Location = {
    name: string;
    address: string;
    lat: number;
    lng: number;
}

type Article = {
    title: string;
    titleEn: string;  // 新增英文标题
    cover: string;    // 新增封面
    content: string;
    category: string;
    publishDate: Date;
    status: string;
    showOnHome: boolean;  // 新增首页展示控制字段
    registrationLink: string;  // 新增报名链接字段
    locations: Location[];  // 新增 locations 字段类型
    //是否满员
    isFull: boolean;
    //是否包机票
    isAirline: boolean;
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
            validation: {
                required: true,
                requiredMessage: "请上传封面图片"
            },
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
                <Editor 
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
        isFull: {
            name: "是否满员",
            dataType: "boolean",
            defaultValue: false
        },
        isAirline: {
            name: "是否包机票",
            dataType: "boolean",
            defaultValue: false
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
        },
        registrationLink: {
            name: "报名链接",
            description: "课程或活动的报名链接（选填）",
            dataType: "string",
            validation: {
                required: false,
                matches: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                matchesMessage: "请输入有效的URL地址"
            }
        },
        locations: {
            name: "地点",
            description: "课程或活动的举办地点",
            dataType: "array",
            of: {
                dataType: "map",
                properties: {
                    name: {
                        name: "位置名称",
                        dataType: "string",
                        validation: { required: true }
                    },
                    address: {
                        name: "详细地址",
                        dataType: "string",
                        validation: { required: true }
                    },
                    lat: {
                        name: "纬度",
                        dataType: "number",
                        validation: {
                            required: true,
                            min: -90,
                            max: 90
                        }
                    },
                    lng: {
                        name: "经度",
                        dataType: "number",
                        validation: {
                            required: true,
                            min: -180,
                            max: 180
                        }
                    }
                }
            }
        }
    }
}); 