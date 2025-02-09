import { buildCollection } from "@firecms/core";

type User = {
    username: string;
    role: string;
    email: string;
    status: string;
}

export const usersCollection = buildCollection<User>({
    name: "用户管理",
    path: "users",
    id: "users",
    properties: {
        username: {
            name: "用户名",
            validation: { required: true },
            dataType: "string"
        },
        role: {
            name: "角色",
            validation: { required: true },
            dataType: "string",
            enumValues: {
                student: "学生",
                teacher: "教师",
                admin: "管理员"
            }
        },
        email: {
            name: "邮箱",
            validation: { required: true },
            dataType: "string"
        },
        status: {
            name: "状态",
            dataType: "string",
            enumValues: {
                active: "活跃",
                inactive: "未激活",
                blocked: "已封禁"
            }
        }
    }
}); 