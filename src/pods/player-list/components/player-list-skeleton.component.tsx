import { Grid, Card, CardContent, Skeleton, Box } from '@mui/material';

const SKELETON_COUNT = 12;

export function PlayerListSkeletonComponent() {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                <Skeleton variant="circular" width={56} height={56} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="40%" height={28} />
                  <Skeleton variant="text" width="70%" height={20} />
                  <Skeleton variant="text" width="55%" height={18} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <Skeleton key={j} variant="text" width={24} height={32} />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
