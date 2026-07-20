import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '3x2g2pvc',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are all required.' },
        { status: 400 }
      )
    }

    const doc = await client.create({
      _type: 'message',
      name,
      email,
      message,
      submittedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, id: doc._id })
  } catch (err) {
    console.error('Contact form submission failed:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}