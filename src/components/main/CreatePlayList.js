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


function CreatePlayList(props) {
    console.log(props.route.params, 'these are params')
    const propsItem = { ...props.route.params }
    const { width, height } = useWindowDimensions()
    const [playListArary, setPlayListArray] = useState([])
    const imagArray = [
        { url: "https://picsum.photos/200/300" },
        { url: "https://picsum.photos/200/300" },
        { url: "https://picsum.photos/200/300" },
        { url: "https://picsum.photos/200/300" },
        { url: "https://picsum.photos/200/300" },
        { url: "https://picsum.photos/200/300" },
        { url: "https://picsum.photos/200/300" },
        { url: "https://picsum.photos/200/300" },

    ]

    useEffect(() => {
        setPlayListArray([...playListArary, propsItem])
    }, [propsItem])

    useEffect(() => {
        console.log(playListArary, 'its play list')
    }, [playListArary])

    return (
        <View style={{ flex: 1, backgroundColor: Colors.darkerblack }}>
            <StatusBar backgroundColor={Colors.darkerblack} />
            <SafeAreaView style={{ flex: 1 }}>
                <HeaderComponent
                    firstitemtext={true}
                    textone={'CANCEL'}
                    title={'PLAYLIST'}
                    thirditemtext={false}
                    imagetwo={ImagePath.backicon}
                    imagetwoStyle={styles.imageTwoStyle}
                    onPressFirstItem={() => {
                        props.navigation.goBack();
                    }}
                    onPressThirdItem={() => Alert.alert('Post this library')}
                />
                <View style={{ flex: 1, }}>
                    {playListArary &&
                        <View style={styles.topContainerStyle}>
                            <Text style={styles.mainTitleStyle} numberOfLines={1}>
                                @ 08 Summer Mix
                            </Text>
                            <View style={[styles.combienBanerWrapper, {
                                width: width / 1.9,
                                height: width / 1.9
                            }]}>
                                {
                                    imagArray?.map((item) => {
                                        return (
                                            <Image
                                                source={{ uri: item?.image }}
                                                style={styles.bannerImageStyle}
                                                resizeMode="cover"
                                            />
                                        )
                                    }
                                    )
                                }
                            </View>
                            <View style={[styles.bottomLineStyle, { width: width / 2 }]}>
                            </View>
                        </View>
                    }
                    <View style={styles.playListItemContainer}>
                        <FlatList
                            data={imagArray}
                            renderItem={() => {
                                return (
                                    <View style={styles.itemWrapper}>
                                        <Image
                                            source={
                                                ImagePath.dp2
                                            }
                                            style={styles.songListItemImage}
                                            resizeMode="contain"
                                        />
                                        <View style={styles.listItemHeaderSongText}>
                                            <Text style={styles.songlistItemHeaderSongTextTitle} numberOfLines={2}>
                                                Summer 91 (Looking Back)
                                            </Text>
                                            <Text style={styles.songlistItemHeaderSongTextArtist} numberOfLines={1}>
                                                Noizu
                                            </Text>
                                        </View>
                                    </View>
                                )
                            }}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={item => item._id}
                        />

                    </View>
                </View>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("AddSong", { from: 'PlayList' })}
                        style={styles.buttonStyle}>
                        <Text
                            style={{
                                color: Colors.white,
                                fontSize: normalise(10),
                                fontWeight: 'bold',
                            }}>
                            ADD SONG
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    topContainerStyle: {
        // justifyContent: 'center',
        alignItems: 'center',
        marginTop: normalise(25)
    },
    mainTitleStyle: {
        color: Colors.white,
        fontFamily: 'ProximaNova-Regular',
        fontSize: normalise(14),
        marginBottom: normalise(14),

    },
    combienBanerWrapper: {
        flexDirection: 'row',
        backgroundColor: 'green',
        flexWrap: 'wrap',
        backgroundColor: Colors.fadeblack,
        marginBottom: normalise(10),
        overflow: 'hidden'

    },
    bannerImageStyle: {
        width: '50%',
        height: '50%',
    },
    bottomLineStyle: {
        // marginTop: normalise(20),
        backgroundColor: Colors.white,
        height: 0.5,
        alignSelf: 'center',
        opacity: 0.7,
    },
    playListItemContainer: {
        width: '75%',
        alignSelf: 'center',
        marginTop: normalise(15),
        flex: 1,
        marginBottom: normalise(62)
    },
    itemWrapper: {
        flexDirection: 'row',
        marginBottom: normalise(16),
        flex: 1,
    },
    songListItemImage: {
        borderRadius: normalise(5),
        height: normalise(56),
        width: normalise(56),
        marginRight: normalise(8)
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
        // backgroundColor: 'green',
        justifyContent: 'center'
    },

    songlistItemHeaderSongTextTitle: {
        color: Colors.white,
        fontFamily: 'ProximaNova-Semibold',
        fontSize: normalise(13),
        marginBottom: normalise(5),
    },
    songlistItemHeaderSongTextArtist: {
        color: Colors.meta,
        fontFamily: 'ProximaNova-Regular',
        fontSize: normalise(12),
    },
    buttonWrapper: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 0,
        // bottom: Platform.OS === 'ios' ? normalise(24) : normalise(23),
        bottom: 0,
    },
    buttonStyle: {
        backgroundColor: Colors.fadeblack,
        padding: 6,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 5,
        width: '75%',
        height: normalise(62),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    imageTwoStyle: {
        height: normalise(14),
        width: normalise(14),
        transform: [{
            rotate: '-180deg'
        }]
    }
})



export default CreatePlayList
