import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { useSearchParams } from "next/navigation";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title } = await request.json();

        if (!title) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }

        const task = await prisma.task.create({
            data: {
                title,
                userId: session.user.id,
            }
        })

        console.log(task);

        return NextResponse.json({ 
            success: true,
            task
        });

    } catch (error) {
        return NextResponse.json(
            { error: "Error creating tasks" },
            { status: 500 }
        );
    }
}
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }


        const tasks = await prisma.task.findMany({
            where:{
                userId: session.user.id
            },
            orderBy:{
                createdAt:"desc"
            }
        })

        console.log(tasks);

        return NextResponse.json({ 
            success: true,
            tasks
        });
        
    } catch (error) {
        return NextResponse.json(
            { error: "Error fetching tasks" },
            { status: 500 }
        );
    }
}