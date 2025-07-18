import { ref } from 'vue'

const menuOpen = ref(false)
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

export function useMenuBar() {
  return { menuOpen, toggleMenu }
} 