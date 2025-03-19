import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    {params}:{params: {id: string}}
) {
    try {

        const session = await auth();

        if(!session || !session.user?.id){
            return NextResponse.json({error:"Unauthorized"},{status:401});
        }
        
        const taskId = await params.id;
        const task = await prisma.task.findUnique({
            where:{
                id:taskId,
                userId: session.user.id
            }
        })
        if (!task) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            task
        })

    } catch (error) {

        return NextResponse.json(
            { error: "Error fetching task" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    {params}:{params: {id: string}}
) {
    try {

        const session = await auth();

        if(!session || !session.user?.id){
            return NextResponse.json({error:"Unauthorized"},{status:401});
        }
        
        const taskId = await params.id;

        const {title,completed} = await request.json();
        
        const existingTask = await prisma.task.findUnique({
            where:{
                id:taskId,
                userId: session.user.id
            }
        })

        if (!existingTask) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            );
        }
        const updatedTask = await prisma.task.update({
            where:{
                id:taskId
            },
            data:{
                title,
                completed
            }
        })
        
        return NextResponse.json({
            success: true,
            task:updatedTask
        })

    } catch (error) {
        
        return NextResponse.json(
            { error: "Error updating task" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if(!session || !session.user?.id){
            return NextResponse.json({error:"Unauthorized"},{status:401});
        }
        
        const taskId = await params.id;
        
        // Check if task exists and belongs to user
        const existingTask = await prisma.task.findUnique({
            where: {
                id: taskId,
                userId: session.user.id
            }
        });
        
        if (!existingTask) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            );
        }
        
        // Delete the task
        await prisma.task.delete({
            where: {
                id: taskId
            }
        });
        
        return NextResponse.json({ 
            success: true,
            message: "Task deleted successfully"
        });
        
    } catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json(
            { error: "Error deleting task" },
            { status: 500 }
        );
    }
}