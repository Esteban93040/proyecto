import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import TechBadge from '../atoms/TechBadge';
import type { Project } from '../../types/project';

interface ProjectDialogProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDialog({ project, onClose }: ProjectDialogProps) {
  return (
    <Dialog
      open={!!project}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: '#0f0f0f',
            color: '#fff',
            border: `1px solid ${project?.color ?? '#ffffff22'}`,
            borderRadius: 3,
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {project?.title}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: '#ffffff22' }}>
        <Typography sx={{ mb: 3, lineHeight: 1.8, opacity: 0.85 }}>
          {project?.description}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {project?.tech.map((t) => (
            <TechBadge key={t} label={t} color={project.color} />
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        {project?.link && (
          <Button
            variant="outlined"
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: project.color, borderColor: project.color }}
          >
            Ver en GitHub
          </Button>
        )}
        <Button onClick={onClose} sx={{ color: '#fff' }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
