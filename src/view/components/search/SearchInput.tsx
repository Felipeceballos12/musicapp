import React from 'react';
import { View, Pressable, TextInput } from 'react-native';

import { colors } from '@/lib/colors';
import { Search, X } from 'lucide-react-native';

function SearchInput() {
  const [inputIsFocused, setInputIsFocused] =
    React.useState<boolean>(false);

  return (
    <View
      style={{
        maxWidth: 500,
        width: '100%',
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: colors.neutral600,
      }}
    >
      <Search
        style={{ marginRight: 6, alignSelf: 'center' }}
        size={21}
        color={colors.neutral900}
      />
      <TextInput
        placeholder="Search"
        placeholderTextColor={colors.neutral900}
        selectTextOnFocus
        enterKeyHint="search"
        value={query}
        style={{
          flex: 1,
          fontSize: 18,
          borderWidth: 0,
        }}
        onChangeText={handleQuery}
        onSubmitEditing={onSubmit}
        onFocus={() => setInputIsFocused(true)}
        onBlur={() => {
          // HACK
          // give 100ms to not stop click handlers in the search history
          // -prf
          setTimeout(() => setInputIsFocused(false), 100);
        }}
        autoCorrect={false}
        autoFocus={false}
        autoComplete="off"
        autoCapitalize="none"
      />
      {query ? (
        <Pressable
          style={{ marginLeft: 6 }}
          onPress={onPressClearQuery}
        >
          <X size={21} color={colors.neutral900} />
        </Pressable>
      ) : undefined}
    </View>
  );
}

export default SearchInput;
