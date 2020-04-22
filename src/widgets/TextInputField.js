import React from "react";
import { View, Platform, Text, TextInput, TouchableOpacity, Image } from "react-native";
import PropTypes from "prop-types";
import normalize from "../utils/helpers/Dimens";
import Colors from "../assests/Colors";

function TextInputField(props) {

    function onChangeText(text) {
        if (props.onChangeText) {
            props.onChangeText(text)
        }
    }

    return (
        <View style={{ width: '100%', marginTop: normalize(props.marginTop), marginBottom: normalize(props.marginBottom) }}>


            <Text style={{ fontSize: normalize(10), color: Colors.white, fontWeight: 'bold' }}>{props.text}</Text>

            <TextInput

                style={{ width:'100%',
                    marginTop: normalize(10), fontWeight: '400', fontSize: normalize(12),
                    backgroundColor: Colors.fadeblack, height: normalize(45), borderRadius: normalize(10),
                    borderWidth: normalize(1), padding: normalize(5), paddingLeft: normalize(20),
                    borderColor: props.borderColor, color: Colors.white,
                }}

                placeholder={props.placeholder}
                maxLength={props.maxLength}
                autoCapitalize={props.autoCapitalize}
                value={props.value}
                placeholderTextColor={props.placeholderTextColor}
                secureTextEntry={props.isPassword}
                onChangeText={(text) => { onChangeText(text) }}

            />

        </View>

    )
}


export default TextInputField;

TextInputField.propTypes = {
    placeholder: PropTypes.string,
    maxLength: PropTypes.number,
    autoCapitalize: PropTypes.string,
    isPassword: PropTypes.bool,
    value: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    onChangeText: PropTypes.func,
    marginTop: PropTypes.number,
    text: PropTypes.string,
    marginBottom: PropTypes.number,
    borderColor: PropTypes.string
}

TextInputField.defaultProps = {
    placeholder: "",
    maxLength: 40,
    autoCapitalize: 'none',
    isPassword: false,
    // value: "",
    placeholderTextColor: Colors.grey,
    onChangeText: null,
    marginTop: normalize(12),
    text: "",
    marginBottom: normalize(0),
    borderColor: Colors.grey
}