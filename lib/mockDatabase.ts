// モックデータベース
// bcryptハッシュされたパスワード
const mockUsers = [
  {
    id: 1,
    email: 'admin@example.com',
    password: '$2b$10$2O/q3t2UxDPpId9oE2bAruqW9y6PSINeOykO4GW38EdDtHf5sMDNC', // adminpass
    name: '管理者'
  },
  {
    id: 2,
    email: 'user1@example.com',
    password: '$2b$10$0nUE4ZV3ODbi8E9iPH6OLuNzXSwvleDUta1R38DobFl3j78Ez7w26', // userpass1
    name: '一般ユーザー'
  }
]

const mockClocks = [
  {
    id: 1,
    userId: 1,
    clockIn: '2024-01-15T09:00:00Z',
    clockOut: '2024-01-15T18:00:00Z',
    createdAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 2,
    userId: 2,
    clockIn: '2024-01-15T08:30:00Z',
    clockOut: null,
    createdAt: '2024-01-15T08:30:00Z'
  }
]

export const mockSupabase = {
  from: (table: string) => ({
    select: (columns?: string) => ({
                          eq: (column: string, value: any) => ({
                      single: async () => {
                        if (table === 'User') {
                          const user = mockUsers.find(u => u[column as keyof typeof u] === value)
                          return { data: user, error: user ? null : { code: 'PGRST116' } }
                        }
                        return { data: null, error: { code: 'PGRST116' } }
                      },
        gte: (column2: string, value2: any) => ({
          lt: (column3: string, value3: any) => ({
            is: (column4: string, value4: any) => ({
                                        single: async () => {
                            if (table === 'Clock') {
                              const clock = mockClocks.find(c =>
                                c[column as keyof typeof c] === value &&
                                (c[column2 as keyof typeof c] as string) >= value2 &&
                                (c[column3 as keyof typeof c] as string) < value3 &&
                                c[column4 as keyof typeof c] === value4
                              )
                              return { data: clock, error: clock ? null : { code: 'PGRST116' } }
                            }
                            return { data: null, error: { code: 'PGRST116' } }
                          }
            }),
                                    single: async () => {
                          if (table === 'Clock') {
                            const clock = mockClocks.find(c =>
                              c[column as keyof typeof c] === value &&
                              (c[column2 as keyof typeof c] as string) >= value2 &&
                              (c[column3 as keyof typeof c] as string) < value3
                            )
                            return { data: clock, error: clock ? null : { code: 'PGRST116' } }
                          }
                          return { data: null, error: { code: 'PGRST116' } }
                        }
          })
        }),
        order: (column: string, options?: any) => ({
                              async then(resolve: any) {
                      if (table === 'Clock') {
                        const filteredClocks = mockClocks.filter(c => c[column as keyof typeof c] === value)
                        const sortedClocks = filteredClocks.sort((a, b) => {
                          const aVal = a[column as keyof typeof a] as string
                          const bVal = b[column as keyof typeof b] as string
                          return options?.ascending ?
                            (aVal < bVal ? -1 : 1) :
                            (aVal > bVal ? -1 : 1)
                        })
                        resolve({ data: sortedClocks, error: null })
                      }
                      resolve({ data: [], error: null })
                    }
        })
      }),
      order: (column: string, options?: any) => ({
                          async then(resolve: any) {
                    if (table === 'Clock') {
                      const sortedClocks = [...mockClocks].sort((a, b) => {
                        const aVal = a[column as keyof typeof a] as string
                        const bVal = b[column as keyof typeof b] as string
                        return options?.ascending ?
                          (aVal < bVal ? -1 : 1) :
                          (aVal > bVal ? -1 : 1)
                      })
                      resolve({ data: sortedClocks, error: null })
                    }
                    resolve({ data: [], error: null })
                  }
      })
    }),
    insert: (data: any) => ({
      select: () => ({
                            single: async () => {
                      if (table === 'Clock') {
                        const newClock = {
                          id: mockClocks.length + 1,
                          ...data[0],
                          createdAt: new Date().toISOString()
                        }
                        mockClocks.push(newClock)
                        return { data: newClock, error: null }
                      }
                      return { data: null, error: null }
                    }
      })
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
                              single: async () => {
                      if (table === 'Clock') {
                        const clockIndex = mockClocks.findIndex(c => c[column as keyof typeof c] === value)
                        if (clockIndex !== -1) {
                          mockClocks[clockIndex] = { ...mockClocks[clockIndex], ...data }
                          return { data: mockClocks[clockIndex], error: null }
                        }
                      }
                      return { data: null, error: { message: 'Update failed' } }
                    }
        })
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
                          async then(resolve: any) {
                    if (table === 'Clock') {
                      const clockIndex = mockClocks.findIndex(c => c[column as keyof typeof c] === value)
                      if (clockIndex !== -1) {
                        mockClocks.splice(clockIndex, 1)
                        resolve({ error: null })
                      } else {
                        resolve({ error: { message: 'Delete failed' } })
                      }
                    }
                    resolve({ error: null })
                  }
      })
    })
  })
} 