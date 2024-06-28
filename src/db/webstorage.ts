import { Contact, Contacts } from "@/types/contacts"

export const storage = localStorage

export function addContact(contact: Contact) {
  storage.setItem("", JSON.stringify(""))
}
