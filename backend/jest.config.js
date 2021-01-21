module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testRegex: ".*\\.spec\\.[jt]s$",
    globals: {
        "ts-jest": {
            diagnostics: false
        }
    },
    moduleNameMapper: {
        "@/(.*)": "<rootDir>/src/$1"
    }
};
