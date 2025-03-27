import React from 'react';
import { Image, Modal, Text, View, Pressable } from 'react-native';
import _ from 'lodash';

import ImagePath from '../../assests/ImagePath';
import normalise from '../../utils/helpers/Dimens';
import LinearGradient from 'react-native-linear-gradient';

const ReportModal = ({ reportModal, setReportModal, contentType="Post" }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={reportModal}
      presentationStyle="overFullScreen">
      <LinearGradient
        colors={['rgba(159, 0, 255, 0.6)', 'rgba(3, 150, 91, 0.6)']}
        locations={[0, 0.5, 1]}
        useAngle={true}
        angle={315}
        angleCenter={{ x: -2, y: 1 }}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: normalise(12),
        }}>
        <View
          style={{
            backgroundColor: '#121317',
            borderRadius: normalise(8),
            boxShadow: '0px -8px 40px rgba(0, 0, 0, 0.4)',
            padding: normalise(16),
            width: '100%',
          }}>
          <View
            style={{
              alignItems: 'flex-start',
              borderBottomColor: '#25262A',
              borderBottomWidth: normalise(1),
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: '#fff',
                fontFamily: 'ProximaNova-Bold',
                fontSize: normalise(14),
                marginBottom: normalise(12),
              }}>
              {contentType} Reported
            </Text>
            <Pressable
              onPress={() => {
                setReportModal(false);
              }}>
              <Image
                source={ImagePath.modalClose}
                style={{
                  height: normalise(24),
                  right: normalise(-4),
                  top: normalise(-4),
                  width: normalise(24),
                }}
              />
            </Pressable>
          </View>
          <View
            style={{
              paddingTop: normalise(12),
            }}>
            <Text
              style={{
                color: '#fff',
                fontFamily: 'ProximaNova-Regular',
                fontSize: normalise(11),
                marginBottom: normalise(10),
              }}>
                  {contentType === "User" ? "Thanks for reporting this user, we will look into the profile and remove should it breach any of our policies." : 
                  "Thanks for reporting this post, we will look into the content and remove should it breach any of our policies."}
              
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Modal>
  );
};

export default ReportModal;
