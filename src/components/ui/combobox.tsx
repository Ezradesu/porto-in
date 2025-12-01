"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/supabaseClient"

interface User {
    user_id: string
    username: string
    profile_image_url: string | null
}

export function UserCombobox() {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [query, setQuery] = React.useState("")
    const [users, setUsers] = React.useState<User[]>([])
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        const fetchUsers = async () => {
            if (!query) {
                setUsers([])
                return
            }

            setLoading(true)
            try {
                const { data, error } = await supabase
                    .from("personal_info")
                    .select("user_id, username, profile_image_url")
                    .ilike("username", `%${query}%`)
                    .limit(5)

                if (error) {
                    console.error("Error fetching users:", error)
                } else {
                    setUsers(data || [])
                }
            } catch (error) {
                console.error("Error fetching users:", error)
            } finally {
                setLoading(false)
            }
        }

        const debounce = setTimeout(() => {
            fetchUsers()
        }, 300)

        return () => clearTimeout(debounce)
    }, [query])

    const handleSelect = (currentValue: string) => {
        setValue(currentValue === value ? "" : currentValue)
        setOpen(false)
        router.push(`/${currentValue}`)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-white/80 backdrop-blur-sm"
                >
                    {value
                        ? users.find((user) => user.username === value)?.username || value
                        : "Find a portfolio..."}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Search username..."
                        value={query}
                        onValueChange={setQuery}
                    />
                    <CommandList>
                        {loading && (
                            <div className="p-2 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                        )}
                        {!loading && users.length === 0 && query && (
                            <CommandEmpty>No user found.</CommandEmpty>
                        )}
                        {!loading && users.length > 0 && (
                            <CommandGroup heading="Suggestions">
                                {users.map((user) => (
                                    <CommandItem
                                        key={user.user_id}
                                        value={user.username}
                                        onSelect={handleSelect}
                                        className="cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2 w-full">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={user.profile_image_url || ""} alt={user.username} />
                                                <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <span>{user.username}</span>
                                        </div>
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value === user.username ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
