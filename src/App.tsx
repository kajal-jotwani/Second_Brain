import { Button } from './components/Button'
import { PluxIcon } from './components/icons/PlusIcon';

function App() {
  return (
    <>
      <Button startIcon={<PluxIcon size="md" />} variant="primary" size="md" text="Primary Button" onclick={() => { console.log('Primary Button clicked'); }} />
      <Button variant="secondary" size="lg" text="Secondary Button" onclick={() => { console.log('Secondary Button clicked'); }} />
    </>
  )
}

export default App