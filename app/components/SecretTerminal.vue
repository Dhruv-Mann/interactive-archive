<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
    <div class="w-full max-w-2xl bg-[#08080C] border-2 border-[#CCFF00] rounded-xl overflow-hidden shadow-[0_0_50px_rgba(204,255,0,0.3)] font-mono">
      
      <!-- Terminal Header -->
      <div class="px-4 py-3 bg-[#12121A] border-b border-[#CCFF00]/30 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-[#FF007F] inline-block"></span>
          <span class="w-3 h-3 rounded-full bg-[#CCFF00] inline-block"></span>
          <span class="w-3 h-3 rounded-full bg-[#00F0FF] inline-block"></span>
          <span class="text-xs text-white/70 font-bold ml-2">NEXUS_CORE_TERMINAL // v2.6.4</span>
        </div>
        <button 
          @click="closeTerminal" 
          class="text-white/60 hover:text-[#FF007F] text-xs font-bold px-2 py-1 transition-colors"
        >
          [ESC / CLOSE]
        </button>
      </div>

      <!-- Output Screen -->
      <div ref="outputRef" class="p-6 h-72 overflow-y-auto space-y-3 text-xs leading-relaxed text-[#CCFF00] cyber-scanlines">
        <div class="text-white/40">Type 'help' for available commands. Try 'party', 'matrix', or 'stats'.</div>
        <div v-for="(line, idx) in logHistory" :key="idx" :class="line.isCommand ? 'text-white font-bold' : 'text-[#CCFF00]/90 whitespace-pre-wrap'">
          <span v-if="line.isCommand" class="text-[#00F0FF] mr-2">nexus@host:~$</span>
          {{ line.text }}
        </div>
      </div>

      <!-- Command Input Row -->
      <form @submit.prevent="executeCommand" class="px-4 py-3 bg-[#0E0E14] border-t border-[#CCFF00]/30 flex items-center gap-2">
        <span class="text-[#00F0FF] text-xs font-bold">nexus@host:~$</span>
        <input
          ref="inputRef"
          v-model="inputCommand"
          type="text"
          class="flex-1 bg-transparent border-none outline-none text-xs text-[#CCFF00] font-mono focus:ring-0"
          placeholder="enter command..."
          autofocus
        />
        <button type="submit" class="px-3 py-1 bg-[#CCFF00] text-black text-xs font-bold rounded hover:bg-white transition-colors">
          EXEC
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { TERMINAL_COMMANDS } from '~/constants/terminalContent'
import { useSoundEngine } from '~/composables/useSoundEngine'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'triggerParty'): void
}>()

const inputCommand = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const outputRef = ref<HTMLDivElement | null>(null)
const sound = useSoundEngine()

const logHistory = ref<{ text: string; isCommand: boolean }[]>([
  { text: 'SYSTEM INITIALIZED. SECURITY BYPASS ACTIVE.', isCommand: false },
])

const closeTerminal = () => {
  sound.playClick()
  emit('close')
}

const executeCommand = async () => {
  const cmd = inputCommand.value.trim().toLowerCase()
  if (!cmd) return

  logHistory.value.push({ text: cmd, isCommand: true })
  inputCommand.value = ''
  sound.playClick()

  if (cmd === 'clear') {
    logHistory.value = []
  } else if (cmd === 'party') {
    logHistory.value.push({ text: '🎉 LAUNCHING CONFETTI BLAST & SYNTH ARPEGGIO!', isCommand: false })
    sound.playConfetti()
    emit('triggerParty')
  } else if (cmd === 'synth') {
    logHistory.value.push({ text: '🔊 PLAYING CYBER CHORD PASS...', isCommand: false })
    sound.playPad(3)
    setTimeout(() => sound.playPad(7), 200)
  } else if (TERMINAL_COMMANDS[cmd]) {
    logHistory.value.push({ text: TERMINAL_COMMANDS[cmd], isCommand: false })
  } else {
    logHistory.value.push({ text: `Unknown command: '${cmd}'. Type 'help' for command manual.`, isCommand: false })
  }

  await nextTick()
  if (outputRef.value) {
    outputRef.value.scrollTop = outputRef.value.scrollHeight
  }
}
</script>
