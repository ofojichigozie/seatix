import Avatar from 'boring-avatars';

interface AvatarProps {
  name: string;
  size?: number;
}

export default function UserAvatar({ name, size = 40 }: AvatarProps) {
  return (
    <Avatar
      size={size}
      name={name}
      variant="beam"
      colors={['#2563EB', '#1D4ED8', '#DBEAFE', '#60A5FA', '#EFF6FF']}
    />
  );
}
