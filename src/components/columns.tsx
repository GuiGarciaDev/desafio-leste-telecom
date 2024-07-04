"use client"

import { Contact } from "@/types/contacts"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Checkbox } from "@/components/ui/checkbox"
import { useContactStore } from "@/db/storage"
import { useState } from "react"
import EditFormDialog from "./EditContactDialog"
import { Select } from "@radix-ui/react-select"
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command"
import { months } from "@/lib/months"
import { getBirthdateFromAge } from "@/utils/birthday"

export const columns: ColumnDef<Contact>[] = [
  // {
  //   accessorKey: "avatar",
  //   header: "Avatar",
  //   cell: ({ row }) => <img src={row.getValue("avatar")} alt="User avatar" />,
  // },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const first_name = row.getValue("first_name")
      const last_name = row.getValue("last_name")

      const full_name = `${first_name} ${last_name}`

      return <div>{full_name}</div>
    },
  },
  {
    accessorKey: "last_name",
    header: "",
    cell: () => <div className="invisible"></div>,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "gender",
    header: ({ column }) => {
      return (
        <Select
          onValueChange={(value) =>
            value === "N"
              ? column.setFilterValue("")
              : column.setFilterValue(value)
          }
        >
          <SelectTrigger className="">
            <SelectValue placeholder="Gênero" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="N">Limpar</SelectItem>
            <SelectItem value="M">Masculino</SelectItem>
            <SelectItem value="F">Feminino</SelectItem>
          </SelectContent>
        </Select>
      )
    },
  },
  {
    accessorKey: "language",
    header: ({ column }) => {
      const { contacts } = useContactStore()
      return (
        <Select
          onValueChange={(value) =>
            value === "N"
              ? column.setFilterValue("")
              : column.setFilterValue(value)
          }
        >
          <SelectTrigger className="">
            <SelectValue placeholder="Idioma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="N">Todos</SelectItem>
            {contacts.map((contact) => {
              return (
                <SelectItem value={contact.language} key={contact.id}>
                  {contact.language}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      )
    },
  },
  {
    accessorKey: "birthday",
    header: ({ column }) => {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Data de nascimento</Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px]">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Filtro Avançado</h4>
                <p className="text-sm text-muted-foreground">
                  Filtre seus contatos pela idade ou pelo mês de nascimento.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    className="col-span-2 h-8"
                    onChange={(e) => {
                      if (e.target.value === "") {
                        column.setFilterValue("")
                      } else {
                        const age = +e.target.value
                        const bornYear = getBirthdateFromAge(age).slice(0, 5)
                        console.log(bornYear)

                        column.setFilterValue(bornYear)
                      }
                    }}
                  />
                </div>
                <Command>
                  <CommandInput placeholder="Filtrar mês" />
                  <CommandList>
                    <CommandEmpty>Não encontrado.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="Todos"
                        onSelect={() => column.setFilterValue("")}
                      >
                        Todos
                      </CommandItem>
                      {months.map((month) => {
                        return (
                          <CommandItem
                            key={month.name}
                            value={month.name}
                            onSelect={() =>
                              column.setFilterValue(`-${month.value}-`)
                            }
                          >
                            {month.name}
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const contact = row.original

      const { removeContact } = useContactStore()
      const [editForm, setEditForm] = useState(false)

      return (
        <>
          <EditFormDialog
            isOpen={editForm}
            setIsOpen={setEditForm}
            data={contact}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Opções</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${contact.first_name} ${contact.last_name}`
                  )
                }
              >
                Copiar nome
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem>Ver perfil</DropdownMenuItem>

              <DropdownMenuItem onClick={() => setEditForm(true)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => removeContact(contact.id)}
                className="text-destructive"
              >
                Remover
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )
    },
  },
]
