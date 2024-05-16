import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { COLORS } from '../assets/theme/index.js';
import { SelectList } from 'react-native-dropdown-select-list';
import Ionic from 'react-native-vector-icons/Ionicons';

const ThemeModal = ({ visible, onClose, type }) => {
  const [isEnableMode, setIsEnableMode] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState('Choose Protocol');
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isBillCompletionNotificationEnabled, setIsBillCompletionNotificationEnabled] = useState(false);

  const toggleTheme = () => {
    setIsEnableMode(!isEnableMode);
  };

  const handleProtocolChange = (protocol) => {
    setSelectedProtocol(protocol);
    // You can handle protocol selection logic here
  };

  const toggleNotifications = () => {
    setIsNotificationsEnabled(!isNotificationsEnabled);
    // You can handle enabling/disabling general notifications here
  };

  const toggleBillCompletionNotification = () => {
    setIsBillCompletionNotificationEnabled(!isBillCompletionNotificationEnabled);
    // You can handle enabling/disabling bill completion notifications here
  };

  const renderContent = () => {
    if (type === 'theme') {
      return (
        <View>
          <Text style={styles.modalTitle}>Auto Connect</Text>
          <View style={styles.themeOption}>
            <Text style={styles.themeText}>
              {isEnableMode ? 'Enable' : 'Disable'}
            </Text>
            <Switch
              value={isEnableMode}
              onValueChange={toggleTheme}
              thumbColor={COLORS.primary}
              trackColor={{ false: 'lightgray', true: COLORS.primary }}
            />
          </View>
        </View>
      );
    } else if (type === 'protocol') {
      return (
        <View>
          <Text style={styles.modalTitle}>Select Protocol</Text>
          <SelectList
            setSelected={(protocol) => handleProtocolChange(protocol)}
            data={['OpenVPN', 'IKEv2/IPsec', 'WireGuard']}
            
          
            search={false}
            save="value"
            placeholder={selectedProtocol}
            boxStyles={{ borderWidth: 0, left: -16, top: -10 }}
            arrowicon={<Ionic style={{ position: 'absolute', right: -15, top: 14 }} size={26} color='gray' name='chevron-down-outline' />}
            inputStyles={{ fontSize: 18.5, top: 1, fontFamily: 'Poppins-Regular', color: 'gray' }}
            dropdownTextStyles={{ fontFamily: 'Poppins-Regular', fontSize: 15, color: 'gray' }}
          />
        </View>
      );
    } else if (type === 'notifications') {
      return (
        <View>
          <Text style={styles.modalTitle}>Notification Settings</Text>
          <View style={styles.notificationOption}>
            <Text style={styles.notificationText}>Enable Notifications</Text>
            <Switch
              value={isNotificationsEnabled}
              onValueChange={toggleNotifications}
              thumbColor={COLORS.primary}
              trackColor={{ false: 'lightgray', true: COLORS.primary }}
            />
          </View>
          <View style={styles.notificationOption}>
            <Text style={styles.notificationText}>Bill Completion Notifications</Text>
            <Switch
              value={isBillCompletionNotificationEnabled}
              onValueChange={toggleBillCompletionNotification}
              thumbColor={COLORS.primary}
              trackColor={{ false: 'lightgray', true: COLORS.primary }}
            />
          </View>
        </View>
      );
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {renderContent()}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 17,
    top: 1,
    marginBottom: 20,
    color: COLORS.primary,
    fontFamily: 'Poppins-SemiBold',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  themeText: {
    fontSize: 16,
    top: 1,
    color: COLORS.primary,
    fontFamily: 'Poppins-Regular',
  },
  notificationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  notificationText: {
    fontSize: 16,
    top: 1,
    color: COLORS.primary,
    fontFamily: 'Poppins-Regular',
  },
  picker: {
    height: 50,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    top: 1,
  },
});

export default ThemeModal;
