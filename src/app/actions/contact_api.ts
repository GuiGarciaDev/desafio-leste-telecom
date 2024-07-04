"use server"

import { Contacts } from "@/types/contacts"

export async function getContactsFromAPIData(): Promise<Contacts> {
  const data = await fetch("http://localhost:3000/api")
    .then((res) => res.json())
    .then((data: Contacts) => data)

  return data
}
