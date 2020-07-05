import React from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import vision, {VisionBarcodeValueType} from '@react-native-firebase/ml-vision';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    borderWidth: 3,
    height: 60,
    width: 150,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
  },
});

const options = {
  title: 'Select',
  takePhotoButtonTitle: '',
};

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          ImagePicker.showImagePicker(options, async (response) => {
            if (response.error) {
              console.log('ImagePicker Error: ', response.error);
              return;
            }

            const path = Platform.select({
              ios: response.uri,
              android: response.path,
            });

            if (!path) {
              return;
            }

            const barcodes = await vision().barcodeDetectorProcessImage(path);
            if (barcodes.length === 0) {
              return;
            }

            barcodes.forEach((barcode) => {
              if (barcode.valueType === VisionBarcodeValueType.URL) {
                Alert.alert('Barcode contains URL info: ', barcode.url.url);
              }
            });
          });
        }}>
        <Text style={styles.buttonText}>読み込む</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default App;
