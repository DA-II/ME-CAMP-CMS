import { buildCollection, EntityReference } from "@firecms/core";

type Class = {
    className: string;
    teacher: EntityReference;
    students: EntityReference[];
    schedule: {
        weekday: string;
        course: EntityReference;
    }[];
}

export const classesCollection = buildCollection<Class>({
    name: "班级管理",
    path: "classes",
    id: "classes",
    properties: {
        className: {
            name: "班级名称",
            validation: { required: true },
            dataType: "string"
        },
        teacher: {
            name: "班主任",
            dataType: "reference",
            path: "users"
        },
        students: {
            name: "学生列表",
            dataType: "array",
            of: {
                dataType: "reference",
                path: "users"
            }
        },
        schedule: {
            name: "课程表",
            dataType: "array",
            of: {
                dataType: "map",
                properties: {
                    weekday: {
                        name: "星期",
                        dataType: "string",
                        enumValues: {
                            monday: "周一",
                            tuesday: "周二",
                            wednesday: "周三",
                            thursday: "周四",
                            friday: "周五"
                        }
                    },
                    course: {
                        name: "课程",
                        dataType: "reference",
                        path: "courses"
                    }
                }
            }
        }
    }
}); 