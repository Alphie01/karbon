"use server";

import mysql from "mysql2/promise";
import { prisma } from "@/lib/prisma";import { revalidatePath } from "next/cache";


// Helper to create connection
async function getConnection(config: any) {
    return await mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
    });
}

// 1. Test Connection & Get Tables
export async function testConnection(formData: FormData) {
    const config = {
        host: formData.get("host") as string,
        user: formData.get("user") as string,
        password: formData.get("password") as string,
        database: formData.get("database") as string,
    };

    try {
        const connection = await getConnection(config);
        const [rows] = await connection.execute("SHOW TABLES");
        await connection.end();

        const tables = (rows as any[]).map((row) => Object.values(row)[0]);
        return { success: true, tables };
    } catch (error: any) {
        console.error("Connection Error:", error);
        return { success: false, error: error.message || "Bağlantı hatası" };
    }
}

// 2. Get Table Schema (Columns)
export async function getTableSchema(formData: FormData) {
    const config = {
        host: formData.get("host") as string,
        user: formData.get("user") as string,
        password: formData.get("password") as string,
        database: formData.get("database") as string,
    };
    const table = formData.get("table") as string;

    try {
        const connection = await getConnection(config);
        const [rows] = await connection.execute(`DESCRIBE ${table}`);
        await connection.end();

        const columns = (rows as any[]).map((row) => row.Field);
        return { success: true, columns };
    } catch (error: any) {
        console.error("Schema Error:", error);
        return { success: false, error: error.message };
    }
}

// 3. Execute Import
export async function executeImport(prevState: any, formData: FormData) {
    const config = {
        host: formData.get("host") as string,
        user: formData.get("user") as string,
        password: formData.get("password") as string,
        database: formData.get("database") as string,
    };
    const table = formData.get("table") as string;

    // Mapping: Local Field -> Remote Column
    const mapping = {
        title: formData.get("map_title") as string,
        content: formData.get("map_content") as string,
        date: formData.get("map_date") as string,
        category: formData.get("category_default") as string || "Yönetmelik"
    };

    try {
        const connection = await getConnection(config);
        // Select only mapped columns
        const queryCols = [mapping.title, mapping.content, mapping.date].filter(Boolean).join(", ");
        const [rows] = await connection.execute(`SELECT ${queryCols || '*'} FROM ${table} LIMIT 100`); // Limit for safety
        await connection.end();

        const dataToInsert = (rows as any[]).map(row => ({
            title: row[mapping.title] || "Başlıksız",
            content: row[mapping.content] || "",
            // Simple date conversion or handling
            date: row[mapping.date] ? String(row[mapping.date]) : undefined,
            category: mapping.category,
            summary: row[mapping.content] ? String(row[mapping.content]).substring(0, 150) + "..." : ""
        }));

        // Bulk insert (using transaction or createMany)
        // Prisma createMany is supported in SQLite
        await (prisma as any).legislation.createMany({
            data: dataToInsert
        });

        revalidatePath("/manage/legislation");
        return { success: true, count: dataToInsert.length };
    } catch (error: any) {
        console.error("Import Error:", error);
        return { success: false, error: error.message };
    }
}
