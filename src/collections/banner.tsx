import { buildCollection } from "@firecms/core";

type Banner = {
    title: string;
    image: string;
    link: string;
    order: number;
    active: boolean;
    startDate: Date;
    endDate: Date;
}

export const bannerCollection = buildCollection<Banner>({
    name: "Banner图片",
    singularName: "Banner",
    path: "banners",
    id: "banners",
    permissions: ({ authController }) => ({
        edit: true,
        create: true,
        delete: true
    }),
    properties: {
        title: {
            name: "标题",
            validation: { required: true },
            dataType: "string"
        },
        image: {
            name: "图片",
            dataType: "string",
            storage: {
                storagePath: "banners",
                acceptedFiles: ["image/*"],
                metadata: {
                    cacheControl: "max-age=1000000"
                },
                storeUrl: true
            },
            validation: {
                required: true
            }
        },
        link: {
            name: "跳转链接",
            dataType: "string",
            validation: {
                required: false
            }
        },
        order: {
            name: "排序",
            description: "数字越小越靠前",
            dataType: "number",
            validation: {
                required: true
            }
        },
        active: {
            name: "是否启用",
            dataType: "boolean",
            defaultValue: true
        },
        startDate: {
            name: "开始时间",
            dataType: "date",
            validation: {
                required: false
            }
        },
        endDate: {
            name: "结束时间",
            dataType: "date",
            validation: {
                required: false
            }
        }
    }
}); 