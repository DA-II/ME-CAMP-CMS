import { buildCollection, EntityReference } from "@firecms/core";

type Attendance = {
    class: EntityReference;
    date: Date;
    records: {
        student: EntityReference;
        status: string;
    }[];
}

export const attendanceCollection = buildCollection<Attendance>({
    name: "考勤管理",
    path: "attendance",
    id: "attendance",
    properties: {
        class: {
            name: "班级",
            dataType: "reference",
            path: "classes",
            validation: { required: true }
        },
        date: {
            name: "日期",
            dataType: "date",
            validation: { required: true }
        },
        records: {
            name: "考勤记录",
            dataType: "array",
            of: {
                dataType: "map",
                properties: {
                    student: {
                        name: "学生",
                        dataType: "reference",
                        path: "users"
                    },
                    status: {
                        name: "状态",
                        dataType: "string",
                        enumValues: {
                            present: "出勤",
                            absent: "缺勤",
                            late: "迟到",
                            leave: "请假"
                        }
                    }
                }
            }
        }
    }
}); 