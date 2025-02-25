import { buildCollection } from "@firecms/core";

type Testimonial = {
    body: string;
    author: string;
    date: string;
}

export const testimonialsCollection = buildCollection<Testimonial>({
    name: "用户评价",
    path: "testimonials",
    id: "testimonials",
    properties: {
        body: {
            name: "评价内容",
            validation: { 
                required: true,
                requiredMessage: "请输入评价内容"
            },
            dataType: "string",
            multiline: true
        },
        author: {
            name: "评价人",
            validation: { 
                required: true,
                requiredMessage: "请输入评价人姓名"
            },
            dataType: "string"
        },
        date: {
            name: "评价日期",
            validation: { 
                required: true,
                requiredMessage: "请选择评价日期"
            },
            dataType: "string",
            description: "用户提供评价的日期"
        }
    }
}); 