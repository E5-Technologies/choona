import React, { useState } from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import normalise from '../../utils/helpers/Dimens';
import StatusBar from '../../utils/MyStatusBar';


function SessionLaunchScreen(props) {
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
            <LinearGradient
                colors={['#0E402C', '#101119', '#360455']}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
                <StatusBar backgroundColor={Colors.darkerblack} />
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.headerStyle}>
                        <TouchableOpacity onPress={() => props.navigation.goBack()}>
                            <Image
                                source={ImagePath.backicon}
                                style={{ width: normalise(16), height: normalise(14) }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={[{ alignItems: 'center', flexDirection: 'row' }]} onPress={() => props.navigation.navigate('SessionActive')}>
                            <Text style={[styles.listItemHeaderSongTextTitle, { marginBottom: normalise(0), fontSize: normalise(10) }]} numberOfLines={2}>
                                START{'\n'}SESSION
                            </Text>
                            <Image
                                source={ImagePath.playSolid}
                                style={styles.startSessionIcon}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, }}>
                        <View style={{ flex: 2.5, }}>
                            <View style={styles.listItemHeaderSongDetails}>
                                <Text style={styles.hostedText} numberOfLines={1}>
                                    Hosted by
                                </Text>
                                <View style={styles.nameWrapper}>
                                    <Text style={[styles.listItemHeaderSongTextTitle, { textTransform: 'uppercase', }]} numberOfLines={2}>
                                        @Ankush009
                                    </Text>
                                    <Image
                                        source={ImagePath.blueTick}
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
                                    keyExtractor={item => item?._id}
                                />
                            </View>
                        </View>
                        <View style={[styles.listenersContainer, {}]}>
                            <View style={{ marginBottom: normalise(15), marginTop: normalise(10) }}>
                                <View style={{}}>
                                    <Text style={[styles.listItemHeaderSongTextTitle, { textAlign: 'center', textAlignVertical: 'center', marginBottom: normalise(0) }]} numberOfLines={2}>
                                        LISTENERS (0)
                                    </Text>
                                    <View style={{ marginLeft: 20, position: 'absolute', right: -80, }}>
                                        <Text style={[{ textAlign: 'center', color: Colors.meta, fontSize: normalise(12), marginBottom: normalise(3) }]} numberOfLines={2}>
                                            Private
                                        </Text>
                                        <Image
                                            source={ImagePath.iconadd
                                            }
                                            style={{ width: 25, height: 15 }}
                                            resizeMode="cover"
                                        />
                                    </View>
                                </View>
                                <View style={[styles.bottomLineStyle, { width: width / 2, }]}>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={ImagePath.iconadd}
                                    style={styles.inviteIcon}
                                    resizeMode="cover"
                                />
                                <Text style={[styles.listItemHeaderSongTextTitle, { marginLeft: normalise(8) }]} numberOfLines={2}>
                                    Send
                                    Invite
                                </Text>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    playListItemContainer: {
        width: '100%',
        alignSelf: 'center',
        marginTop: normalise(15),
        flex: 1,
        marginLeft: normalise(60)
    },

    itemWrapper: {
        flexDirection: 'row',
        marginBottom: normalise(10),
        flex: 1,
        width: '100%',
        alignItems: 'center'
    },
    songListItemImage: {
        borderRadius: normalise(5),
        height: normalise(49),
        width: normalise(49),
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
        marginTop: normalise(2),
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
    },
    inviteIcon: {
        borderRadius: normalise(5),
        height: normalise(25),
        width: normalise(25),
    },
    headerStyle: {
        justifyContent: "space-between", flexDirection: 'row', alignItems: 'center', paddingHorizontal: normalise(24),
        paddingVertical: normalise(15),
    },
    startSessionIcon: {
        width: 16,
        height: 16
    },
    hostedText: {
        color: Colors.meta,
        fontFamily: 'ProximaNova-Regular',
        fontSize: normalise(12),
    }
})



export default SessionLaunchScreen
