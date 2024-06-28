"use client"
import { Contacts } from "@/types/contacts"
import { useEffect, useState } from "react"

export default function Home() {
  const [contacts, setContacts] = useState<Contacts>([])

  useEffect(() => {
    fetch("https://my.api.mockaroo.com/lestetelecom/test.json?key=f55c4060")
      .then((res) => res.json())
      .then((data) => setContacts(data))
  }, [])

  return (
    <div className="flex w-full h-full justify-center p-10">
      <ul className="flex flex-col gap-10">
        {contacts.map((contact) => {
          return (
            <li key={contact.id} className="flex flex-col">
              <span>{contact.id}</span>
              <span>{`${contact.first_name} ${contact.last_name}`}</span>
              <span>{contact.language}</span>
              <span>{contact.birthday}</span>
              <span>{contact.email}</span>
              <span>{contact.avatar}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
