import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import normalise from '../../../utils/helpers/Dimens';
import { useNavigation } from '@react-navigation/native';

const HomeSessionItem = ({
    onPressMusicbox,
    play,
    postType,
    singer = "i am singer",
    songUri,
    // title = 'This is new song',
    verified = true
}) => {
    const navigation=useNavigation()
    return (
        <TouchableOpacity style={styles.listItemHeaderContainer} onPress={()=>navigation.navigate('SessionDetail')}>
            <View style={styles.listItemHeaderSongDetails}>
                <View style={styles.nameWrapper}>
                    <Text style={styles.listItemHeaderSongTextTitle} numberOfLines={2}>
                        @Ankush009
                    </Text>
                    {verified &&
                        <Image
                            source={ImagePath.green_tick}
                            style={{ width: 16, height: 16 }}
                            resizeMode="contain"
                        />
                    }
                </View>
                <Image
                    source={ImagePath.apple_icon_round
                    }
                    style={styles.listItemHeaderSongTypeIcon}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.songlistWrapperBox}>
                <FlatList
                    data={Array(3).fill('')}
                    renderItem={() => {
                        return (
                            <View style={{ flexDirection: 'row', marginBottom: normalise(4), flex: 1, }}>
                                <Image
                                    source={
                                        ImagePath.dp2
                                    }
                                    style={styles.songListItemImage}
                                    resizeMode="contain"
                                />
                                <View style={styles.listItemHeaderSongText}>
                                    <Text style={styles.songlistItemHeaderSongTextTitle} numberOfLines={1}>
                                        This is new song, music hhhj
                                    </Text>
                                    <Text style={styles.songlistItemHeaderSongTextArtist} numberOfLines={1}>
                                        {singer}  i a singer
                                    </Text>
                                </View>
                            </View>
                        )
                    }}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item._id}
                />
                <View style={styles.bottomLineStyle}>

                </View>
            </View>
            {/* {songUri && (
                <TouchableOpacity
                    disabled={disabled}
                    onPress={() => {
                        setDisabled(true);
                        onPressMusicbox();
                        setTimeout(() => {
                            setDisabled(false);
                        }, 1000);
                    }}
                    style={styles.listItemHeaderPlayButton}>
                    <Image
                        source={
                            ImagePath ? (play ? ImagePath.pause : ImagePath.play) : null
                        }
                        style={styles.listItemHeaderPlay}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            )} */}
        </TouchableOpacity>
    );
};

export default HomeSessionItem;

const styles = StyleSheet.create({
    listItemHeaderContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: normalise(12),
        paddingVertical: normalise(12),
        position: 'relative',
        backgroundColor: Colors.darkerblack,
        flex: 1,
    },
    nameWrapper: {
        // alignItems: 'center',
        flexDirection: 'row',
    },
    listItemHeaderSongDetails: {
        alignItems: 'center',
        flex: 0.8,
        // flexDirection: 'row',
    },
    listItemHeaderSongTextTitle: {
        color: Colors.white,
        fontFamily: 'ProximaNova-Semibold',
        fontSize: normalise(14),
        marginBottom: normalise(5),
        marginRight: normalise(5),
    },
    listItemHeaderSongTypeIcon: {
        borderRadius: normalise(10),
        height: normalise(90),
        width: normalise(90),
        borderRadius: normalise(80),

    },
    listItemHeaderSongText: {
        alignItems: 'flex-start',
        flexDirection: 'column',
        marginLeft: normalise(10),
        // maxWidth: normalise(240),
        width: '100%',
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.fadeblack,
        paddingBottom: normalise(3),
        flex: 1,
    },
    songlistWrapperBox: {
        marginLeft: normalise(10),
        flex: 1.2,
        // borderBottomWidth: 0.5,
        // paddingBottom: normalise(5),
        // borderBottomColor: Colors.white,
    },

    songListItemImage: {
        borderRadius: normalise(5),
        height: normalise(30),
        width: normalise(30),
    },
    songlistItemHeaderSongTextTitle: {
        color: Colors.white,
        fontFamily: 'ProximaNova-Semibold',
        fontSize: normalise(12),
        marginBottom: normalise(5),
        // paddingRight: normalise(5),
    },

    songlistItemHeaderSongTextArtist: {
        color: Colors.darkgrey,
        fontFamily: 'ProximaNova-Regular',
        fontSize: normalise(9),
        // paddingRight: normalise(5)
    },
    listItemHeaderPlayButton: {
        height: normalise(36),
        paddingLeft: normalise(6),
        paddingTop: normalise(6),
        position: 'absolute',
        right: normalise(6),
        top: normalise(6),
        width: normalise(36),
    },
    bottomLineStyle: {
        marginTop: normalise(10),
        backgroundColor: Colors.white,
        height: 0.5,
        width: '70%',
        alignSelf: 'center',
        opacity: 0.7

    },
    listItemHeaderPlay: { height: normalise(24), width: normalise(24) },
});
