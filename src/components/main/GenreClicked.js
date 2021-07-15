import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import StatusBar from '../../utils/MyStatusBar';

const genreData = [
  {
    image: ImagePath.genretrack,
  },
  {
    image: ImagePath.genretrack2,
  },
  {
    image: ImagePath.genretrack3,
  },
  {
    image: ImagePath.genretrack,
  },
  {
    image: ImagePath.genretrack2,
  },
  {
    image: ImagePath.genretrack3,
  },
  {
    image: ImagePath.genretrack,
  },
  {
    image: ImagePath.genretrack2,
  },
];

export default function GenreClicked(props) {
  const [name, setName] = useState(props.route.params.data);

  function renderGenreData(data) {
    return (
      <TouchableOpacity
        style={{
          marginBottom:
            data.index === genreData.length - 1 ? normalise(30) : normalise(-2),
        }}
        // onPress={()=>{props.navigation.navigate("GenreSongClicked")}}
      >
        <Image
          source={data.item.image}
          style={{
            height: normalise(140),
            width: normalise(140),
            margin: normalise(6),
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.black }}>
      <StatusBar backgroundColor={Colors.darkerblack} />

      <SafeAreaView style={{ flex: 1 }}>
        <HeaderComponent
          firstitemtext={false}
          imageone={ImagePath.backicon}
          title={name.toUpperCase()}
          thirditemtext={true}
          texttwo={''}
          onPressFirstItem={() => {
            props.navigation.goBack();
          }}
        />

        <FlatList
          style={{
            paddingTop: normalise(20),
            alignSelf: 'center',
            width: '95%',
          }}
          data={genreData}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => {
            index.toString();
          }}
          renderItem={renderGenreData}
          numColumns={2}
        />
      </SafeAreaView>
    </View>
  );
}
