import { buildCollection } from "@firecms/core";

type GalleryItem = {
    title: string;
    titleEn: string;
    type: "image" | "video";
    imageUrl?: string;
    videoUrl?: string;
    order: number;
    status: string;
    createDate: Date;
}

export const galleryCollection = buildCollection<GalleryItem>({
    name: "图片视频库",
    path: "gallery",
    id: "gallery",
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
        type: {
            name: "类型",
            validation: { required: true },
            dataType: "string",
            enumValues: {
                image: "图片",
                video: "视频"
            }
        },
        imageUrl: {
            name: "图片",
            dataType: "string",
            validation: {
                required: false,
            },
            storage: {
                storagePath: "gallery/images",
                acceptedFiles: ["image/*"],
                metadata: {
                    cacheControl: "public,max-age=86400"
                },
                storeUrl: true
            }
        },
        videoUrl: {
            name: "视频链接",
            dataType: "string",
            validation: {
                required: false,
                matches: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com|bilibili\.com).*$/,
                matchesMessage: "请输入有效的视频平台链接（支持YouTube、Vimeo、Bilibili等）"
            },
            description: "支持YouTube、Vimeo、Bilibili等视频平台的链接"
        },
        order: {
            name: "排序",
            validation: { required: true },
            dataType: "number",
            description: "数字越小排序越靠前"
        },
        status: {
            name: "状态",
            dataType: "string",
            validation: { 
                required: true,
                requiredMessage: "请选择状态"
            },
            enumValues: {
                draft: "草稿",
                published: "已发布",
                archived: "已归档"
            }
        },
        createDate: {
            name: "创建日期",
            dataType: "date",
            validation: { required: true },
            defaultValue: new Date(),
            disabled: true
        }
    },
    defaultValues: {
        status: "draft",
        order: 1,
        createDate: new Date()
    }
}); 