import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    Image,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../../auth/context/AuthContext';

const AllChildrenScreen = ({ navigation }: any) => {
    const { students } = useAuth();
    const [searchText, setSearchText] = useState('');

    const filteredStudents = useMemo(() => {
        if (!students || students.length === 0) {
            return [];
        }

        const normalizedSearch = searchText.trim().toLowerCase();
        if (!normalizedSearch) {
            return students;
        }

        return students.filter((child: any) =>
            String(child?.name || '').toLowerCase().includes(normalizedSearch)
        );
    }, [students, searchText]);

    const renderChildCard = ({ item: child }: { item: any }) => {
        const age = child?.age || 8;
        const grade = Math.max(1, age - 5);

        return (
            <Pressable
                style={styles.childCard}
                onPress={() => navigation.navigate('ChildProgress', { childId: child.id })}
            >
                {child?.avatar ? (
                    <Image source={{ uri: child.avatar }} style={styles.avatarImage} />
                ) : (
                    <Image
                        source={require('../../assets/Homescreen/student.png')}
                        style={styles.avatarImage}
                        resizeMode="cover"
                    />
                )}

                <View style={styles.childInfo}>
                    <Text style={styles.childName}>{child?.name || 'Child'}</Text>
                    <Text style={styles.childMeta}>Age {age} • Grade {grade}</Text>
                </View>

                <View style={styles.focusPill}>
                    <Text style={styles.focusLabel}>FOCUS</Text>
                    <Text style={styles.focusValue}>8.5/10</Text>
                </View>
            </Pressable>
        );
    };

    if (!students || students.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyStateContainer}>
                    <Icon name="account-child-outline" size={56} color="#9CA3AF" />
                    <Text style={styles.emptyTitle}>No children added</Text>
                    <Text style={styles.emptySubtitle}>Add a child to start tracking progress.</Text>
                    <Pressable
                        style={styles.addChildButton}
                        onPress={() => navigation.navigate('ParentAddChild')}
                    >
                        <Text style={styles.addChildButtonText}>Add Child</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={filteredStudents}
                keyExtractor={(child: any) => String(child.id)}
                renderItem={renderChildCard}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.headerSection}>
                        <Text style={styles.title}>All Children</Text>
                        <View style={styles.searchContainer}>
                            <Icon name="magnify" size={20} color="#6B7280" />
                            <TextInput
                                value={searchText}
                                onChangeText={setSearchText}
                                placeholder="Search by child name"
                                placeholderTextColor="#9CA3AF"
                                style={styles.searchInput}
                            />
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.noResultsContainer}>
                        <Text style={styles.noResultsText}>No children found for this search.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    headerSection: {
        paddingTop: 8,
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1B337F',
        marginBottom: 12,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchInput: {
        flex: 1,
        height: 44,
        marginLeft: 8,
        color: '#1A1A2E',
        fontSize: 14,
    },
    listContent: {
        paddingBottom: 24,
    },
    childCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginTop: 12,
        borderRadius: 18,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    avatarImage: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#F3F4F6',
    },
    childInfo: {
        flex: 1,
        marginLeft: 12,
    },
    childName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    childMeta: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    focusPill: {
        alignItems: 'flex-end',
    },
    focusLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 0.4,
    },
    focusValue: {
        marginTop: 2,
        fontSize: 14,
        fontWeight: '700',
        color: '#1B337F',
    },
    noResultsContainer: {
        marginTop: 40,
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    noResultsText: {
        fontSize: 14,
        color: '#6B7280',
    },
    emptyStateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    emptyTitle: {
        marginTop: 14,
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    emptySubtitle: {
        marginTop: 8,
        textAlign: 'center',
        fontSize: 14,
        color: '#6B7280',
    },
    addChildButton: {
        marginTop: 18,
        backgroundColor: '#1B337F',
        borderRadius: 12,
        paddingHorizontal: 18,
        paddingVertical: 12,
    },
    addChildButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
});

export default AllChildrenScreen;
