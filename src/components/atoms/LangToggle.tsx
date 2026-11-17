import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

type Language = 'es' | 'en';

interface LangToggleProps {
  value: Language;
  onChange: (lang: Language) => void;
}

export default function LangToggle({ value, onChange }: LangToggleProps) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_, v: Language) => v && onChange(v)}
      size="small"
      sx={{
        '& .MuiToggleButton-root': { color: '#fff', borderColor: '#ffffff44' },
        '& .Mui-selected': { bgcolor: '#ffffff22 !important', color: '#fff' },
      }}
    >
      <ToggleButton value="es">ES</ToggleButton>
      <ToggleButton value="en">EN</ToggleButton>
    </ToggleButtonGroup>
  );
}
