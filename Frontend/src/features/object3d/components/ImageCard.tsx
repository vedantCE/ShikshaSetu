import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ImageSourcePropType } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { ObjectItem } from '../constants/data';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.m * 3) / 2;

interface ImageCardProps {
    item: ObjectItem;
    isFavorite: boolean;
    isLearned: boolean;
    onPress: () => void;
    onToggleFavorite: () => void;
    category: string;
}

const formatLikes = (count: number) => {
    if (count < 1000) return count.toString();
    if (count < 10000) return (count / 1000).toFixed(1) + 'k';
    return (count / 1000).toFixed(1) + 'k';
};

// Static image mapping matching actual lowercase folder/file structure
const getImageForItem = (category: string, name: string): ImageSourcePropType | null => {
    const key = `${category.toLowerCase()}_${name}`;

    // Fruits - matching actual filenames (lowercase)
    if (key === 'fruits_Apple') return require('../assets/3D_Image/Fruits/apple.png');
    if (key === 'fruits_Banana') return require('../assets/3D_Image/Fruits/banana.png');
    if (key === 'fruits_Mango') return require('../assets/3D_Image/Fruits/mango.png');
    if (key === 'fruits_Orange') return require('../assets/3D_Image/Fruits/orange.png');
    if (key === 'fruits_Grapes') return require('../assets/3D_Image/Fruits/grape.png'); // Note: file is grape.png not grapes.png
    if (key === 'fruits_Pineapple') return require('../assets/3D_Image/Fruits/pinapple.png'); // Note: typo in filename
    if (key === 'fruits_Strawberry') return require('../assets/3D_Image/Fruits/stawberry.png'); // Note: typo in filename
    if (key === 'fruits_Watermelon') return require('../assets/3D_Image/Fruits/watermelon.png');
    if (key === 'fruits_Papaya') return require('../assets/3D_Image/Fruits/papaya.png');
    if (key === 'fruits_Guava') return require('../assets/3D_Image/Fruits/guava.png');

    // Vegetables - matching actual filenames (lowercase)
    if (key === 'vegetables_Carrot') return require('../assets/3D_Image/vegetables/carrot.png');
    if (key === 'vegetables_Potato') return require('../assets/3D_Image/vegetables/potato.png');
    if (key === 'vegetables_Tomato') return require('../assets/3D_Image/vegetables/tomato.png');
    if (key === 'vegetables_Onion') return require('../assets/3D_Image/vegetables/onion.png');
    if (key === 'vegetables_Brinjal') return require('../assets/3D_Image/vegetables/brinjal.png');
    if (key === 'vegetables_Cabbage') return require('../assets/3D_Image/vegetables/cabbage.png');
    if (key === 'vegetables_Spinach') return require('../assets/3D_Image/vegetables/spinach.png');
    if (key === 'vegetables_Peas') return require('../assets/3D_Image/vegetables/peas.png');
    if (key === 'vegetables_Corn') return require('../assets/3D_Image/vegetables/corn.png');
    if (key === 'vegetables_Broccoli') return require('../assets/3D_Image/vegetables/brocoli.png'); // Note: typo in filename

    // Animals - matching actual filenames (lowercase folders and files)
    if (key === 'animals_Lion') return require('../assets/3D_Image/animals/lion.png');
    if (key === 'animals_Tiger') return require('../assets/3D_Image/animals/tiger.png');
    if (key === 'animals_Elephant') return require('../assets/3D_Image/animals/elephant.png');
    if (key === 'animals_Dog') return require('../assets/3D_Image/animals/dog.png');
    if (key === 'animals_Cat') return require('../assets/3D_Image/animals/cat.png');
    if (key === 'animals_Horse') return require('../assets/3D_Image/animals/horse.png');
    if (key === 'animals_Cow') return require('../assets/3D_Image/animals/cow.png');
    if (key === 'animals_Monkey') return require('../assets/3D_Image/animals/monkey.png');
    if (key === 'animals_Bear') return require('../assets/3D_Image/animals/bear.png');
    if (key === 'animals_Deer') return require('../assets/3D_Image/animals/deer.png');

    // Birds - matching actual filenames (lowercase)
    if (key === 'birds_Parrot') return require('../assets/3D_Image/birds/parrot.png');
    if (key === 'birds_Eagle') return require('../assets/3D_Image/birds/eagle.png');
    if (key === 'birds_Owl') return require('../assets/3D_Image/birds/owl.png');
    if (key === 'birds_Penguin') return require('../assets/3D_Image/birds/penguin.png');
    if (key === 'birds_Peacock') return require('../assets/3D_Image/birds/peacock.png');
    if (key === 'birds_Sparrow') return require('../assets/3D_Image/birds/sparrow.png');
    if (key === 'birds_Swan') return require('../assets/3D_Image/birds/swan.png');
    if (key === 'birds_Flamingo') return require('../assets/3D_Image/birds/flamingo.png');
    if (key === 'birds_Duck') return require('../assets/3D_Image/birds/duck.png');
    if (key === 'birds_Crow') return require('../assets/3D_Image/birds/crow.png');

    // Colors - matching actual filenames (lowercase)
    if (key === 'colors_Red') return require('../assets/3D_Image/colors/red.png');
    if (key === 'colors_Blue') return require('../assets/3D_Image/colors/blue.png');
    if (key === 'colors_Green') return require('../assets/3D_Image/colors/green.png');
    if (key === 'colors_Yellow') return require('../assets/3D_Image/colors/yellow.png');
    if (key === 'colors_Orange') return require('../assets/3D_Image/colors/orange.png');
    if (key === 'colors_Purple') return require('../assets/3D_Image/colors/purple.png');
    if (key === 'colors_Pink') return require('../assets/3D_Image/colors/pink.png');
    if (key === 'colors_Brown') return require('../assets/3D_Image/colors/brown.png');
    if (key === 'colors_Black') return require('../assets/3D_Image/colors/black.png');
    if (key === 'colors_White') return require('../assets/3D_Image/colors/white.png');

    // Shapes - matching actual filenames (lowercase)
    if (key === 'shapes_Circle') return require('../assets/3D_Image/shapes/circle.png');
    if (key === 'shapes_Square') return require('../assets/3D_Image/shapes/square.png');
    if (key === 'shapes_Triangle') return require('../assets/3D_Image/shapes/triangle.png');
    if (key === 'shapes_Rectangle') return require('../assets/3D_Image/shapes/rectangle.png');
    if (key === 'shapes_Star') return require('../assets/3D_Image/shapes/star.png');
    if (key === 'shapes_Heart') return require('../assets/3D_Image/shapes/heart.png');
    if (key === 'shapes_Diamond') return require('../assets/3D_Image/shapes/diamond.png');
    if (key === 'shapes_Oval') return require('../assets/3D_Image/shapes/oval.png');
    if (key === 'shapes_Hexagon') return require('../assets/3D_Image/shapes/hexagon.png');
    if (key === 'shapes_Arrow') return require('../assets/3D_Image/shapes/arrow.png');

    // Vehicles - matching actual filenames (lowercase)
    if (key === 'vehicles_Car') return require('../assets/3D_Image/vehicles/car.png');
    if (key === 'vehicles_Bus') return require('../assets/3D_Image/vehicles/bus.png');
    if (key === 'vehicles_Train') return require('../assets/3D_Image/vehicles/train.png');
    if (key === 'vehicles_Airplane') return require('../assets/3D_Image/vehicles/airplane.png');
    if (key === 'vehicles_Bicycle') return require('../assets/3D_Image/vehicles/bicycle.png');
    if (key === 'vehicles_Motorcycle') return require('../assets/3D_Image/vehicles/motorcycle.png');
    if (key === 'vehicles_Boat') return require('../assets/3D_Image/vehicles/boat.png');
    if (key === 'vehicles_Truck') return require('../assets/3D_Image/vehicles/truck.png');
    if (key === 'vehicles_Helicopter') return require('../assets/3D_Image/vehicles/helicopter.png');
    if (key === 'vehicles_Rocket') return require('../assets/3D_Image/vehicles/rocket.png');

    return null;
};

const ImageCard: React.FC<ImageCardProps> = memo(({ item, isFavorite, isLearned, onPress, onToggleFavorite, category }) => {
    // Random like count for demo
    const mockLikes = useMemo(() => Math.floor(Math.random() * 30000) + 1000, []);

    // Get the image source for this item
    const imageSource = getImageForItem(category, item.name);

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
            <View style={styles.card}>
                {imageSource ? (
                    <Image
                        source={imageSource}
                        style={StyleSheet.absoluteFill}
                        resizeMode="contain"
                    />
                ) : (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.emojiPlaceholder}>{item.emoji}</Text>
                    </View>
                )}

                {/* Footer overlay - absolute positioned */}
                <View style={styles.topOverlay}>
                    <View style={styles.likesSection}>
                        <TouchableOpacity onPress={onToggleFavorite}>
                            <Icon
                                name={isFavorite ? 'heart' : 'heart-outline'}
                                size={20}
                                color={isFavorite ? COLORS.heartRed : COLORS.white}
                            />
                        </TouchableOpacity>
                        <Text style={styles.likesText}>{formatLikes(mockLikes)}</Text>
                    </View>
                    {isLearned && <MaterialIcon name="verified" size={18} color={COLORS.success} />}
                </View>

                {/* Name overlay - absolute positioned at bottom */}
                <View style={styles.bottomOverlay}>
                    <Text style={styles.name}>{item.name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: CARD_WIDTH * 1.2,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#000',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        marginBottom: SPACING.m,
    },
    placeholderContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    emojiPlaceholder: {
        fontSize: 60,
    },
    topOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.s,
        backgroundColor: 'rgba(0, 0, 0, 0.0)',
    },
    bottomOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: SPACING.s,
        paddingVertical: SPACING.xs,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    likesSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    likesText: {
        color: COLORS.white,
        fontSize: SIZES.small,
        fontWeight: '500',
    },
    name: {
        color: COLORS.white,
        fontSize: SIZES.body,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default ImageCard;
