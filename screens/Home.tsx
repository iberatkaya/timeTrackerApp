import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { CompositeNavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../AppNav';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Card from '../components/card/Card';
import { lightColor } from './colors';
import { Data } from '../interfaces/Data';
import { setTimer } from '../redux/Actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

interface Props extends StateRedux {
    navigation: CompositeNavigationProp<
        DrawerNavigationProp<{ Home: undefined }, 'Home'>,
        StackNavigationProp<RootStackParamList>
    >;
    setTimer: (a: Array<boolean>) => void;
}

export class HomeScreen extends Component<Props> {
    async componentDidMount() {
        this.props.navigation.setOptions({
            headerLeft: () => {
                return (
                    <TouchableOpacity
                        style={styles.menuView}
                        onPress={() => {
                            this.props.navigation.openDrawer();
                        }}>
                        <Icon name="menu" style={styles.menuIcon} />
                    </TouchableOpacity>
                );
            },
        });
        let timer = await AsyncStorage.getItem('timer');
        console.log('Timer: ' + timer);
        if (timer !== null) {
            if (timer === 'false') this.props.setTimer(this.props.Data.map(() => false));
            else if (timer === 'true') this.props.setTimer(this.props.Data.map(() => true));
        }
    }

    anyTimerActive = () => {
        const { Timer } = this.props;
        const len = Timer.length;
        for (let i = 0; i < len; i++) {
            if (Timer[i] === true) return true;
        }
        return false;
    };

    render() {
        console.log(this.props.Timer);
        return (
            <ScrollView>
                <View style={{ marginTop: 12 }}>
                    {this.props.Data.map((i, index) => (
                        <Card
                            timerActive={this.props.Timer[index]}
                            anyTimerActive={this.anyTimerActive()}
                            data={i}
                            index={index}
                        />
                    ))}
                </View>
            </ScrollView>
        );
    }
}

interface StateRedux {
    Data: Array<Data>;
    Timer: Array<boolean>;
}

const mapStateToProps = (state: StateRedux) => {
    const { Data, Timer } = state;
    return { Data, Timer };
};

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ setTimer }, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(HomeScreen);

const styles = StyleSheet.create({
    menuView: {
        marginLeft: 16,
    },
    menuIcon: {
        fontSize: 28,
        color: lightColor,
    },
});
