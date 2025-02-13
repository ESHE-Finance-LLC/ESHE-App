/**
 * SecurePinInput
 *
    <SecurePinInput />
 *
 */
import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    TouchableWithoutFeedback,
    TextInput,
    Platform,
    NativeSyntheticEvent,
    TextInputKeyPressEventData,
} from 'react-native';

import StyleService from '@services/StyleService';

import { VibrateHapticFeedback } from '@common/helpers/interface';

import { Icon } from '@components/General/Icon';
import { LoadingIndicator } from '@components/General/LoadingIndicator';

import styles from './styles';

/* Types ==================================================================== */
interface Props {
    virtualKeyboard: boolean;
    supportBiometric: boolean;
    length: number;
    clearOnFinish: boolean;
    enableHapticFeedback?: boolean;
    isLoading?: boolean;
    onInputFinish: (pin: string) => void;
    onBiometryPress: () => void;
}

interface State {
    digits: string;
}

const BUTTONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'Y', 0, 'X'];
/* Component ==================================================================== */
class SecurePinInput extends Component<Props, State> {
    currentIndex: number;
    inputRef: React.RefObject<TextInput>;
    private clearInputTimeout: any;

    public static defaultProps = {
        virtualKeyboard: false,
        supportBiometric: true,
        length: 6,
        clearOnFinish: false,
        enableHapticFeedback: true,
        onBiometryPress: () => {},
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            digits: '',
        };

        this.currentIndex = 0;
        this.inputRef = React.createRef();
    }

    componentWillUnmount() {
        if (this.clearInputTimeout) clearTimeout(this.clearInputTimeout);
    }

    public focus = () => {
        const { virtualKeyboard } = this.props;
        if (!virtualKeyboard) {
            // blur first
            if (this.inputRef.current) {
                this.inputRef.current.blur();
            }

            setTimeout(() => {
                if (this.inputRef.current) {
                    this.inputRef.current.focus();
                }
            }, 100);
        }
    };

    public blur = () => {
        const { virtualKeyboard } = this.props;
        if (!virtualKeyboard) {
            setTimeout(() => {
                if (this.inputRef.current) {
                    this.inputRef.current.blur();
                }
            }, 100);
        }
    };

    onDigitInput = (digit: any) => {
        const { digits } = this.state;
        const { length, enableHapticFeedback } = this.props;

        if (enableHapticFeedback) {
            VibrateHapticFeedback('impactLight');
        }

        if (digit === 'Backspace') {
            const arrayCode = digits.split('');
            arrayCode.pop();
            this.setState({
                digits: arrayCode.join(''),
            });
        } else {
            const newDigits = digits + digit;

            if (newDigits.length <= length) {
                this.setState({
                    digits: newDigits,
                });
            }
            // User filling the last pin ?
            if (newDigits.length === length) {
                this.onFinish(newDigits);
            }
        }
    };

    handleEdit = (code: string) => {
        const { length } = this.props;

        // remove any non digits
        const cleanCode = code.replace(/[^0-9]/g, '');

        if (cleanCode) {
            // limit the input for not more than the requested code length
            if (cleanCode.length <= length) {
                this.setState({
                    digits: cleanCode,
                });
            }
            // User filling the last pin ?
            if (cleanCode.length === length) {
                this.onFinish(cleanCode);
            }
        } else {
            this.setState({
                digits: '',
            });
        }
    };

    onKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        const { digits } = this.state;
        if (e.nativeEvent.key === 'Backspace' && Platform.OS === 'android') {
            const arrayCode = digits.split('');
            arrayCode.pop();
            this.setState({
                digits: arrayCode.join(''),
            });
        }
    };

    onFinish = (digits: string) => {
        const { clearOnFinish, onInputFinish } = this.props;

        // blur the input
        this.blur();

        if (onInputFinish) {
            onInputFinish(digits);
        }

        if (clearOnFinish) {
            this.clearInputTimeout = setTimeout(() => this.clearInput(), 1000);
        }
    };

    clearInput = () => {
        this.setState({
            digits: '',
        });
    };

    renderNumText = (flag: number) => {
        const { supportBiometric, onBiometryPress } = this.props;

        return BUTTONS.slice(flag, flag + 3).map((item, index) => {
            if (item === 'X') {
                return (
                    <TouchableHighlight
                        testID="x-key"
                        underlayColor={StyleService.value('$tint')}
                        style={styles.line}
                        key="x-key"
                        onPress={() => {
                            this.onDigitInput('Backspace');
                        }}
                        onLongPress={this.clearInput}
                    >
                        <Icon name="IconChevronLeft" style={styles.iconStyle} size={35} />
                    </TouchableHighlight>
                );
            }
            if (item === 'Y') {
                if (supportBiometric) {
                    return (
                        <TouchableHighlight
                            testID="y-key"
                            underlayColor={StyleService.value('$tint')}
                            style={styles.line}
                            key="y-key"
                            onPress={() => {
                                if (onBiometryPress) {
                                    onBiometryPress();
                                }
                            }}
                        >
                            <Icon name="IconFingerprint" style={styles.iconStyle} size={35} />
                        </TouchableHighlight>
                    );
                }

                return <View key={`${index}-line`} style={styles.line} />;
            }

            const alpha = (n: string | number): string => {
                const alphabet = 'ABC.DEF.GHI.JKL.MNO.PQRS.TUV.WXYZ';
                switch (n) {
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                        return alphabet.split('.')[n - 2];
                    default:
                        return '';
                }
            };

            return (
                <TouchableHighlight
                    testID={`${item}-key`}
                    underlayColor={StyleService.value('$tint')}
                    style={styles.line}
                    activeOpacity={0.7}
                    key={`${item}-key`}
                    onPress={() => {
                        this.onDigitInput(item);
                    }}
                >
                    <>
                        <Text style={styles.numTextInt}>{item}</Text>
                        <Text style={styles.numTextAlpha}>{alpha(item)}</Text>
                    </>
                </TouchableHighlight>
            );
        });
    };
    renderNum() {
        return BUTTONS.map((item, index) => {
            if (index % 3 === 0) {
                return (
                    <View style={styles.numWrap} key={`num-${index}`}>
                        {this.renderNumText(index)}
                    </View>
                );
            }

            return null;
        });
    }

    renderDots = () => {
        const { length } = this.props;
        const { digits } = this.state;

        const elements = [];
        for (let i = 0; i < length; i++) {
            elements.push(
                <View
                    key={`dot-${i}`}
                    style={[styles.pinStyle, digits.length > i ? { ...styles.pinActiveStyle } : {}]}
                />,
            );
        }

        return elements;
    };

    renderLoading = () => {
        return <LoadingIndicator />;
    };

    render() {
        const { virtualKeyboard, isLoading } = this.props;
        const { digits } = this.state;

        let props = {};

        // ios
        if (Platform.OS === 'ios') {
            props = { display: 'none' };
        } else {
            // android
            props = { style: styles.hiddenInput };
        }

        return (
            <TouchableWithoutFeedback testID="pin-input-container" onPress={this.focus}>
                <View style={styles.container}>
                    {!virtualKeyboard && (
                        <TextInput
                            ref={this.inputRef}
                            testID="pin-input"
                            returnKeyType="done"
                            keyboardType="number-pad"
                            onKeyPress={this.onKeyPress}
                            onChangeText={this.handleEdit}
                            autoCorrect={false}
                            spellCheck={false}
                            disableFullscreenUI
                            secureTextEntry
                            caretHidden
                            value={digits}
                            // eslint-disable-next-line
                            {...props}
                        />
                    )}
                    <View style={styles.digits}>{isLoading ? this.renderLoading() : this.renderDots()}</View>

                    {virtualKeyboard && (
                        <View testID="virtual-keyboard" style={styles.keyboardWrap}>
                            {this.renderNum()}
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

/* Export Component ==================================================================== */
export default SecurePinInput;
