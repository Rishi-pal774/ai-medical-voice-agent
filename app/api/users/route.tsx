import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {eq} from "drizzle-orm";

export async function POST(req:NextRequest){
  const user = await currentUser();

  try{

  // Check if User Already Exist
  const users=await db.select().from(usersTable)
  //@ts-ignore
  .where(eq(usersTable.email,user?.primaryEmailAddress?.emailAddress))
  // If Not Then Crate New User
  if (users?.length ==0) {
    const result =await db.insert(usersTable).values({
      name:user?.fullName,
      email:user?.primaryEmailAddress?.emailAddress,
      credits:10
    }).returning();
    return NextResponse.json(result)
     
  }
  
  return NextResponse.json(users[0]);
  }
  catch (e) {
    return NextResponse.json(e);
  }

}