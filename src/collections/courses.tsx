import { buildCollection, EntityReference } from "@firecms/core";

type Course = {
    name: string;
    description: string;
    teacher: EntityReference;
    duration: number;
    status: string;
    category: string;
    materials: string[];
}

export const coursesCollection = buildCollection<Course>({
    name: "课程管理",
    path: "courses",
    id: "courses",
    properties: {
        name: {
            name: "课程名称",
            validation: { required: true },
            dataType: "string"
        },
        description: {
            name: "课程描述",
            validation: { required: true },
            dataType: "string",
            multiline: true
        },
        teacher: {
            name: "授课教师",
            validation: { required: true },
            dataType: "reference",
            path: "users"
        },
        duration: {
            name: "课时",
            validation: { 
                required: true,
                min: 1,
                max: 100
            },
            dataType: "number"
        },
        status: {
            name: "状态",
            validation: { required: true },
            dataType: "string",
            enumValues: {
                active: "进行中",
                upcoming: "即将开始",
                completed: "已结束",
                cancelled: "已取消"
            }
        },
        category: {
            name: "课程类别",
            validation: { required: true },
            dataType: "string",
            enumValues: {
                math: "数学",
                english: "英语",
                science: "科学",
                history: "历史",
                literature: "语文",
                other: "其他"
            }
        },
        materials: {
            name: "课程资料",
            dataType: "array",
            of: {
                dataType: "string",
                storage: {
                    storagePath: "course_materials",
                    acceptedFiles: ["application/pdf", "image/*", "video/*"]
                }
            }
        }
    }
}); 