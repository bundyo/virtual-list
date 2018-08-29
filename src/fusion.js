function createImportPromise(name, Vue) {
    return new Promise((resolve, reject) => {
        import("./components/" + name + ".vue")
            .then(({default: module}) => {
                Vue.component(module.name, module);

                resolve(module);
            })
            .catch(reject);
    });
}

const fusion = {
    install: function (Vue) {
        Vue.directive("fusion-mount", {
            inserted: function (el, binding, vnode) {
                vnode.componentInstance.$emit("mounted", el);
            }
        });

        //Vue.mixin({
        //    created: function () {
        //    }
        //});

        // 4. add an instance method
        Vue.$load = function (module) {
            if (Array.isArray(module)) {
                return Promise.all(module.map((name) => createImportPromise(name, Vue)));
            }

            return createImportPromise(module, Vue);
        };

        Vue.prototype.$fusion = {
            uniqId() {
                return Math.random().toString(36).substr(2, 10);
            },

            convertToObject(str) {
                const splitStr = str ? str.split(" ") : [];
                const map = str ? Object.assign(...splitStr.map(key => ({ [key]: true }))) : {};

                map.classes = str ? Object.assign(...splitStr.map(key => ({ [`-${key}`]: true }))) : {};

                return map;
            },

            getTypeClasses(types, extensions, defaultTypes) {
                return Object.assign(defaultTypes ? defaultTypes.map(key => ({ [key]: true })) : {}, types.classes, extensions);
            }
        };
    }
};

export default fusion;
