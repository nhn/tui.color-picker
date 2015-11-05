var Palette = tui.component.colorpicker.Palette;
describe('view:Palette', function() {
    var inst;

    beforeEach(function() {
        jasmine.getFixtures('test.html');
    });

    it('render() makes button for each palette colors.', function() {
        inst = new Palette({
            preset: ['#000000', '#111111']
        }, inst);
        inst.render();

        expect($('li').length).toBe(2);
    });
});
