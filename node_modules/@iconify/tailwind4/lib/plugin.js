import plugin from 'tailwindcss/plugin';
import { getDynamicCSSRules } from './plugins/dynamic.js';
import { getCSSComponentsForPlugin, getCSSRulesForPlugin, } from './plugins/preparsed.js';
function getBooleanValue(value, defaultValue) {
    switch (value) {
        case true:
        case '1':
        case 'true':
            return true;
        case false:
        case '0':
        case 'false':
            return false;
    }
    return defaultValue ?? false;
}
function getFloatValue(value, defaultValue) {
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'string') {
        // Parse string
        const num = parseFloat(value);
        return isNaN(num) ? defaultValue : num;
    }
    return defaultValue;
}
const exportedPlugin = plugin.withOptions((params) => {
    // Clean up options
    const dynamicOptions = {};
    const preparsedOptions = {};
    // console.log('Params:', JSON.stringify(params, null, 2));
    Object.entries(params ?? {}).forEach(([key, value]) => {
        switch (key) {
            // Options for dynamic plugin
            case 'prefix':
                if (value === false) {
                    // Empty prefix: disables plugin
                    dynamicOptions.prefix = '';
                }
                if (typeof value === 'string') {
                    dynamicOptions.prefix = value;
                }
                return;
            case 'overrideOnly':
            case 'override-only':
            case 'overrideonly':
                dynamicOptions.overrideOnly = getBooleanValue(value, dynamicOptions.overrideOnly ?? false);
                return;
            // Options for preparsed plugin
            case 'prefixes': {
                // prefixes: foo;
                if (typeof value === 'string') {
                    preparsedOptions.prefixes = [value];
                    return;
                }
                // prefixes: foo, bar;
                if (Array.isArray(value)) {
                    preparsedOptions.prefixes = value;
                    return;
                }
                return;
            }
            case 'iconSelector':
            case 'icon-selector':
            case 'iconselector':
                if (typeof value === 'string') {
                    preparsedOptions.iconSelector = value;
                }
                return;
            case 'maskSelector':
            case 'mask-selector':
            case 'maskselector':
                if (typeof value === 'string') {
                    preparsedOptions.maskSelector = value;
                }
                return;
            case 'backgroundSelector':
            case 'background-selector':
            case 'backgroundselector':
                if (typeof value === 'string') {
                    preparsedOptions.backgroundSelector = value;
                }
                return;
            case 'varName':
            case 'var-name':
            case 'varname':
                if (typeof value === 'string') {
                    preparsedOptions.varName = value;
                }
                return;
            case 'square':
                preparsedOptions.square = getBooleanValue(value, preparsedOptions.square ?? true);
                return;
            // Common options
            case 'scale': {
                const scale = getFloatValue(value, dynamicOptions.scale ?? 1);
                dynamicOptions.scale = scale;
                preparsedOptions.scale = scale;
                return;
            }
        }
    });
    return ({ matchComponents, addComponents, addUtilities }) => {
        // Dynamic plugin
        const prefix = dynamicOptions.prefix ?? 'icon';
        if (prefix) {
            matchComponents({
                [prefix]: (icon) => {
                    try {
                        return getDynamicCSSRules(icon, dynamicOptions);
                    }
                    catch (err) {
                        // Log error, but do not throw it
                        console.warn(err.message);
                        return {};
                    }
                },
            });
        }
        // Preparsed options
        if (preparsedOptions.prefixes) {
            addComponents(getCSSComponentsForPlugin(preparsedOptions));
            addUtilities(getCSSRulesForPlugin(preparsedOptions));
        }
    };
});
export default exportedPlugin;
