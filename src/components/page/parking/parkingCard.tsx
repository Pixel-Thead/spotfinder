import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { z } from 'zod';

import { Typography } from '../../ui/typography';

import { useAuth } from '~/src/hooks/auth/useAuth';
import { parkingSchema } from '~/src/utils/validation/parking';

type ParkingDetail = z.infer<typeof parkingSchema>;

type ParkingCardProps = {
  parking: ParkingDetail;
};

export const ParkingCard = ({ parking }: ParkingCardProps) => {
  const router = useRouter();
  const { user } = useAuth();
  return (
    <TouchableOpacity
      key={parking.id}
      onPress={() => router.push(`/parking/${parking.id}`)}
      className="mb-4 overflow-hidden rounded-lg bg-white shadow-sm">
      <Image source={{ uri: parking.image }} className="aspect-video w-full" resizeMode="cover" />
      <View className="p-4">
        <View className="mb-1 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-gray-900">{parking.name}</Text>
          <View className="flex-row items-center">
            <Ionicons
              name={
                user && parking && parking?.rating?.includes(user?.id) ? 'star' : 'star-outline'
              }
              size={16}
              color="#f59e0b"
            />
            <Text className="ml-1 text-gray-700">{parking?.rating?.length}</Text>
          </View>
        </View>

        <Text className="mb-2 text-gray-600">{parking.address}</Text>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="pricetag-outline" size={16} color="#3b82f6" />
            <Text className="ml-1 font-semibold text-blue-600">{parking.price} /hr</Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={16} color="#6b7280" />
            <Text className="ml-1 text-gray-600">{parking.distance}</Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="car-outline" size={16} color="#10b981" />
            <Text className="ml-1 text-green-600">
              {parking.slots?.filter((slot) => slot.isOccupied === false).length || 0}
              <Typography className="text-gray-500">/{parking.slots?.length} spots</Typography>
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
