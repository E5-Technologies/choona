import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import Colors from '../../assests/Colors';
import normalise from '../../utils/helpers/Dimens';
import StatusBar from '../../utils/MyStatusBar';
import HeaderComponent from '../../widgets/HeaderComponent';
import ImagePath from '../../assests/ImagePath';
import { ScrollView } from 'react-native-gesture-handler';


function SessionDetail(props) {
    // console.log(props?.route?.params, 'these are params')
    // const { currentSession } = props?.route?.params
    // console.log(currentSession, 'its current sessionI')
    const { width, height } = useWindowDimensions()
    const [playVisible, setPlayVisible] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [sessionData, setSessionData] = useState({
        userId: '1',
        userName: 'ANkush Dhiman',
        userProfile: 'https://picsum.photos/200/300',
        sessionItem: [{
            id: 1,
            banner: 'https://picsum.photos/200/300',
        },
        {
            id: 1,
            banner: 'https://picsum.photos/200/300',
        },
        {
            id: 1,
            banner: 'https://picsum.photos/200/300',
        },
        {
            id: 1,
            banner: 'https://picsum.photos/200/300',
        },
        {
            id: 1,
            banner: 'https://picsum.photos/200/300',
        },

        {
            id: 1,
            banner: 'https://picsum.photos/200/300',
        },

        ],
        joineeList: [
            {
                id: 1,
                userNma: 'Ajeet',
                userProfile: 'https://picsum.photos/200/300'
            },
            {
                id: 1,
                userNma: 'Ajeet',
                userProfile: 'https://picsum.photos/200/300'
            },
            {
                id: 1,
                userNma: 'Ajeet',
                userProfile: 'https://picsum.photos/200/300'
            },
            {
                id: 1,
                userNma: 'Ajeet',
                userProfile: 'https://picsum.photos/200/300'
            },
            {
                id: 1,
                userNma: 'Ajeet',
                userProfile: 'https://picsum.photos/200/300'
            },
            {
                id: 1,
                userNma: 'Ajeet',
                userProfile: 'https://picsum.photos/200/300'
            },
            {
                id: 1,
                userNma: 'Ajeet',
                userProfile: 'https://picsum.photos/200/300'
            },
            {
                id: 1,
                userNma: 'Ajeet',
                userProfile: 'https://picsum.photos/200/300'
            },
            {
                id: 1,
                userNma: 'Ajeet',
                userProfile: 'https://picsum.photos/200/300'
            },
            {
                id: 1,
                userNma: 'Ajeet',
                userProfile: 'https://picsum.photos/200/300'
            },
            {
                id: 1,
                userNma: 'Ajeet',
                userProfile: 'https://picsum.photos/200/300'
            },
            {
                id: 1,
                userNma: 'Ajeet',
                userProfile: 'https://picsum.photos/200/300'
            },
            {
                id: 1,
                userNma: 'Ajeet',
                userProfile: 'https://picsum.photos/200/300'
            },
            {
                id: 1,
                userNma: 'Ajeet',
                userProfile: 'https://picsum.photos/200/300'
            },
        ]
    })


    return (
        <View style={{ flex: 1, backgroundColor: Colors.darkerblack }}>
            <StatusBar backgroundColor={Colors.darkerblack} />
            <SafeAreaView style={{ flex: 1 }}>
                <HeaderComponent
                    firstitemtext={true}
                    textone={'BACK'}
                    title={'SESSIONS'}
                    thirditemtext={false}
                    imagetwo={ImagePath.addButtonSmall}
                    imagetwoStyle={styles.imageTwoStyle}
                    onPressFirstItem={() => {
                        props.navigation.goBack();
                    }}
                    onPressThirdItem={() => Alert.alert('Post this library')}
                />
                <View style={{ flex: 1, }}>
                    <View style={{ flex: 2.5, }}>
                        <View style={styles.listItemHeaderSongDetails}>
                            <View style={styles.nameWrapper}>
                                <Text style={styles.listItemHeaderSongTextTitle} numberOfLines={2}>
                                    @Ankush009
                                </Text>
                                <Image
                                    source={ImagePath.green_tick}
                                    style={{ width: 16, height: 16 }}
                                    resizeMode="contain"
                                />
                            </View>
                            <Image
                                source={ImagePath.apple_icon_round
                                }
                                style={styles.listItemHeaderSongTypeIcon}
                                resizeMode="contain"
                            />
                            <Text style={[styles.listItemHeaderSongTextTitle, { marginTop: normalise(10) }]} numberOfLines={2}>
                                NOW PLAYING
                            </Text>
                            <View style={[styles.bottomLineStyle, { width: width / 3 }]}>
                            </View>
                        </View>
                        <View style={styles.playListItemContainer}>
                            <FlatList
                                data={sessionData?.sessionItem}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={[styles.itemWrapper]}>
                                            <TouchableOpacity
                                                disabled={disabled}
                                                onPress={() => {
                                                    // setDisabled(true);
                                                    // if (hasSongLoaded) {
                                                    //     playing();
                                                    // }
                                                    // setTimeout(() => {
                                                    //     setDisabled(false);
                                                    // }, 1000);
                                                    Alert.alert('play Song')
                                                }} style={styles.playButtonStyle}>
                                                <Image
                                                    source={playVisible ? ImagePath.play : ImagePath.pause}
                                                    style={{ height: normalise(25), width: normalise(25) }}
                                                    resizeMode="contain"
                                                />
                                            </TouchableOpacity>
                                            <Image
                                                source={{ uri: item?.banner }
                                                }
                                                style={styles.songListItemImage}
                                                resizeMode="cover"
                                            />
                                            <View style={styles.listItemHeaderSongText}>
                                                <Text style={styles.songlistItemHeaderSongTextTitle} numberOfLines={2}>
                                                    Summer 91 (Looking Back)
                                                </Text>
                                                <Text style={styles.songlistItemHeaderSongTextArtist} numberOfLines={1}>
                                                    Noizu
                                                </Text>
                                                {/* <View style={[styles.bottomLineStyle, { width: '100%', opacity:0.4, alignSelf:'baseline'}]}>
                                            </View> */}
                                            </View>

                                        </View>

                                    )
                                }}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={item => item._id}
                            />
                        </View>
                    </View>
                    <View style={styles.listenersContainer}>
                        <Text style={[styles.listItemHeaderSongTextTitle, { marginTop: normalise(10) }]} numberOfLines={2}>
                        LISTENERS
                        </Text>
                        <View style={[styles.bottomLineStyle, { width: width / 3, marginBottom: normalise(20) }]}>
                        </View>
                        <ScrollView>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {
                                    sessionData?.joineeList?.map((item, index) => {
                                        return (
                                            <View style={[styles.joineeIitemWrapper, index == 0 && { marginLeft: normalise(40) }, index == 3 && { marginRight: normalise(40) }]}>
                                                <Image
                                                    source={{ uri: item?.userProfile }
                                                    }
                                                    style={styles.songListItemImage}
                                                    resizeMode="cover"
                                                />
                                            </View>
                                        )
                                    }
                                    )
                                }
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    playListItemContainer: {
        width: '100%',
        alignSelf: 'center',
        marginTop: normalise(15),
        flex: 1,
    },

    itemWrapper: {
        flexDirection: 'row',
        marginBottom: normalise(8),
        flex: 1,
        alignItems: 'center'
    },
    songListItemImage: {
        borderRadius: normalise(5),
        height: normalise(45),
        width: normalise(48),
    },

    imageTwoStyle: {
        height: normalise(18),
        width: normalise(18),
        transform: [{
            rotate: '-180deg'
        }]
    },

    listItemHeaderSongDetails: {
        alignItems: 'center',
        // flex: 1,
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
        height: normalise(100),
        width: normalise(100),
        borderRadius: normalise(80),

    },
    listItemHeaderSongText: {
        alignItems: 'flex-start',
        flexDirection: 'column',
        marginLeft: normalise(10),
        width: '100%',
        height: '100%',
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.meta,
        flex: 1,
        justifyContent: 'center',

    },
    songlistItemHeaderSongTextTitle: {
        color: Colors.white,
        fontFamily: 'ProximaNova-Semibold',
        fontSize: normalise(12),
    },

    songlistItemHeaderSongTextArtist: {
        color: Colors.darkgrey,
        fontFamily: 'ProximaNova-Regular',
        fontSize: normalise(9),
    },

    bottomLineStyle: {
        marginTop: normalise(10),
        backgroundColor: Colors.white,
        alignSelf: 'center',
        opacity: 0.7,
        height: 0.5,
    },

    nameWrapper: {
        flexDirection: 'row',
        marginTop: normalise(16),
        marginBottom: normalise(6),
    },

    playButtonStyle: {
        width: normalise(50),
        height: normalise(50),
        justifyContent: 'center',
        alignItems: 'center'
    },

    //Footer listners styles
    listenersContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    joineeIitemWrapper: {
        width: 50,
        height: 50,
        borderRadius: 50,
        overflow: 'hidden',
        justifyContent: 'center',
        marginHorizontal: normalise(11),
        marginBottom: normalise(7)
    }
})



export default SessionDetail
