export interface WebhookPayload {
  title: string
  description: string
  color?: number
  fields?: Array<{
    name: string
    value: string
    inline?: boolean
  }>
  footer?: {
    text: string
  }
  timestamp?: string
}

export class DiscordWebhook {
  private webhookUrl: string

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl
  }

  async sendMessage(payload: WebhookPayload): Promise<void> {
    try {
      const discordPayload = {
        embeds: [{
          title: payload.title,
          description: payload.description,
          color: payload.color || 0x00ff00,
          fields: payload.fields || [],
          footer: payload.footer || { text: 'Image Hosting Platform' },
          timestamp: payload.timestamp || new Date().toISOString()
        }]
      }

      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordPayload)
      })
    } catch (error) {
      console.error('Discord webhook error:', error)
    }
  }

  async newUser(email: string, name: string, userId: string): Promise<void> {
    await this.sendMessage({
      title: '👤 New User Registration',
      description: 'A new user has joined the platform!',
      color: 0x00ff00,
      fields: [
        { name: 'Email', value: email, inline: true },
        { name: 'Name', value: name || 'Not provided', inline: true },
        { name: 'User ID', value: userId, inline: false }
      ]
    })
  }

  async newUpload(userId: string, fileName: string, fileSize: string, mimeType: string): Promise<void> {
    await this.sendMessage({
      title: '📁 New File Upload',
      description: 'A new file has been uploaded!',
      color: 0x0099ff,
      fields: [
        { name: 'User ID', value: userId, inline: true },
        { name: 'File Name', value: fileName, inline: true },
        { name: 'File Size', value: fileSize, inline: true },
        { name: 'Type', value: mimeType, inline: true }
      ]
    })
  }

  async adminAction(adminId: string, action: string, details: string): Promise<void> {
    await this.sendMessage({
      title: '🔧 Admin Action',
      description: 'An administrator performed an action',
      color: 0xff9900,
      fields: [
        { name: 'Admin ID', value: adminId, inline: true },
        { name: 'Action', value: action, inline: true },
        { name: 'Details', value: details, inline: false }
      ]
    })
  }

  async payment(userId: string, amount: string, plan: string, status: string): Promise<void> {
    await this.sendMessage({
      title: '💳 Payment Processed',
      description: 'A payment has been processed',
      color: status === 'succeeded' ? 0x00ff00 : 0xff0000,
      fields: [
        { name: 'User ID', value: userId, inline: true },
        { name: 'Amount', value: amount, inline: true },
        { name: 'Plan', value: plan, inline: true },
        { name: 'Status', value: status, inline: true }
      ]
    })
  }

  async userBanned(userId: string, adminId: string, reason: string): Promise<void> {
    await this.sendMessage({
      title: '🚫 User Banned',
      description: 'A user has been banned from the platform',
      color: 0xff0000,
      fields: [
        { name: 'Banned User ID', value: userId, inline: true },
        { name: 'Banned By', value: adminId, inline: true },
        { name: 'Reason', value: reason, inline: false }
      ]
    })
  }

  async systemError(error: string, context: string): Promise<void> {
    await this.sendMessage({
      title: '❌ System Error',
      description: 'An error occurred in the system',
      color: 0xff0000,
      fields: [
        { name: 'Context', value: context, inline: true },
        { name: 'Error', value: error, inline: false }
      ]
    })
  }
}

export const webhook = new DiscordWebhook(
  'https://discord.com/api/webhooks/1472613095556911373/79Sdh8cTk5xuUKJXFeGxk0FIwjJTJsVAOeIQnAlGrIdgEE3MMjZuuLQwK5JF7_Xnd5Uh'
)
