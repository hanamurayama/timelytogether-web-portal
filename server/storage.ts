import { type User, type InsertUser, type Reminder, type InsertReminder } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  getReminder(id: string): Promise<Reminder | undefined>;
  getAllReminders(): Promise<Reminder[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private reminders: Map<string, Reminder>;

  constructor() {
    this.users = new Map();
    this.reminders = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createReminder(insertReminder: InsertReminder): Promise<Reminder> {
    const id = randomUUID();
    const reminder: Reminder = {
      ...insertReminder,
      id,
      completionAlerts: insertReminder.completionAlerts ?? false,
      customNotificationEmail: insertReminder.customNotificationEmail ?? null,
      createdAt: new Date(),
    };
    this.reminders.set(id, reminder);
    return reminder;
  }

  async getReminder(id: string): Promise<Reminder | undefined> {
    return this.reminders.get(id);
  }

  async getAllReminders(): Promise<Reminder[]> {
    return Array.from(this.reminders.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }
}

export const storage = new MemStorage();
