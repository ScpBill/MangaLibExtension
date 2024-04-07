async function createPanel() {
    // Parameters manage - json
    const params = JSON.parse(localStorage.getItem('__timecode_parameters'));
    if (!params || !params.teams) {
        localStorage.setItem('__timecode_parameters', '{"teams": []}');
        params = { teams: [] };
    }

    // Popup body - div
    const popup_body = document.getElementsByClassName('popup-body')[0];
    if (!popup_body) return;
    popup_body.setAttribute('style', 'height: calc(100% - 48px);')

    // Remove last main container - div
    const last_main_container = popup_body.getElementsByClassName('_team_parameters')[0];
    if (last_main_container) popup_body.removeChild(last_main_container);

    // Main container - div
    const main_container = document.createElement('div');
    popup_body.lastChild.before(main_container);
    main_container.scroll(0, 1000);
    main_container.setAttribute('class', '_team_parameters');
    main_container.setAttribute('style', `overflow-y: scroll; scrollbar-width: none; margin: 12px 0px;`);

    // For all teams
    for (let team = 0; team < params.teams.length; team++) {

        // Title team inline - div
        const title_team_inline = document.createElement('div');
        main_container.appendChild(title_team_inline);
        title_team_inline.setAttribute('class', 'lj_a4 inputs _inline');
        title_team_inline.setAttribute('style', 'margin: 12px 0px;')

        {
            // Title move block - div
            const title_move_block = document.createElement('div');
            title_team_inline.appendChild(title_move_block);
            title_move_block.setAttribute('style', 'width: 32px; height: 32px; line-height: 0px;');

            {
                // Title move up - button
                const title_move_up_button = document.createElement('button');
                title_move_block.appendChild(title_move_up_button);
                title_move_up_button.setAttribute('class', 'btn is-icon');
                title_move_up_button.setAttribute('style', 'width: 32px; height: 16px; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px;');
                title_move_up_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="18px" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z" fill="${team != 0 ? 'currentColor' : '#595959'}"/></svg>`;
                title_move_up_button.onclick = async () => {
                    if (team == 0) return;
                    params.teams.splice(team - 1, 0, params.teams.splice(team, 1)[0]);
                    localStorage.setItem('__timecode_parameters', JSON.stringify(params));
                    await createPanel();
                };

                // Title move down - button
                const title_move_down_button = document.createElement('button');
                title_move_block.appendChild(title_move_down_button);
                title_move_down_button.setAttribute('class', 'btn is-icon');
                title_move_down_button.setAttribute('style', 'width: 32px; height: 16px; border-top-right-radius: 0px; border-top-left-radius: 0px;');
                title_move_down_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="18px" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="${team + 1 < params.teams.length ? 'currentColor' : '#595959'}"/></svg>`;
                title_move_down_button.onclick = async () => {
                    if (team + 1 == params.teams.length) return;
                    params.teams.splice(team + 1, 0, params.teams.splice(team, 1)[0]);
                    localStorage.setItem('__timecode_parameters', JSON.stringify(params));
                    await createPanel();
                };
            }

            // Title team enabled - button
            const title_team_enabled_button = document.createElement('button');
            title_team_inline.appendChild(title_team_enabled_button);
            title_team_enabled_button.setAttribute('class', 'btn is-icon');
            title_team_enabled_button.setAttribute('type', 'button');
            title_team_enabled_button.innerHTML = params.teams[team].enabled
                ? `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" width="20px" height="20px" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet"><path d="M33.62,17.53c-3.37-6.23-9.28-10-15.82-10S5.34,11.3,2,17.53L1.72,18l.26.48c3.37,6.23,9.28,10,15.82,10s12.46-3.72,15.82-10l.26-.48ZM17.8,26.43C12.17,26.43,7,23.29,4,18c3-5.29,8.17-8.43,13.8-8.43S28.54,12.72,31.59,18C28.54,23.29,23.42,26.43,17.8,26.43Z" class="clr-i-outline clr-i-outline-path-1"/><path d="M18.09,11.17A6.86,6.86,0,1,0,25,18,6.86,6.86,0,0,0,18.09,11.17Zm0,11.72A4.86,4.86,0,1,1,23,18,4.87,4.87,0,0,1,18.09,22.89Z" class="clr-i-outline clr-i-outline-path-2"/><rect x="0" y="0" width="36" height="36" fill-opacity="0"/></svg>`
                : `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" width="20px" height="20px" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet"><path d="M25.19,20.4A6.78,6.78,0,0,0,25.62,18a6.86,6.86,0,0,0-6.86-6.86,6.79,6.79,0,0,0-2.37.43L18,13.23a4.78,4.78,0,0,1,.74-.06A4.87,4.87,0,0,1,23.62,18a4.79,4.79,0,0,1-.06.74Z" class="clr-i-outline clr-i-outline-path-1"/><path d="M34.29,17.53c-3.37-6.23-9.28-10-15.82-10a16.82,16.82,0,0,0-5.24.85L14.84,10a14.78,14.78,0,0,1,3.63-.47c5.63,0,10.75,3.14,13.8,8.43a17.75,17.75,0,0,1-4.37,5.1l1.42,1.42a19.93,19.93,0,0,0,5-6l.26-.48Z" class="clr-i-outline clr-i-outline-path-2"/><path d="M4.87,5.78l4.46,4.46a19.52,19.52,0,0,0-6.69,7.29L2.38,18l.26.48c3.37,6.23,9.28,10,15.82,10a16.93,16.93,0,0,0,7.37-1.69l5,5,1.75-1.5-26-26Zm9.75,9.75,6.65,6.65a4.81,4.81,0,0,1-2.5.72A4.87,4.87,0,0,1,13.9,18,4.81,4.81,0,0,1,14.62,15.53Zm-1.45-1.45a6.85,6.85,0,0,0,9.55,9.55l1.6,1.6a14.91,14.91,0,0,1-5.86,1.2c-5.63,0-10.75-3.14-13.8-8.43a17.29,17.29,0,0,1,6.12-6.3Z" class="clr-i-outline clr-i-outline-path-3"/><rect x="0" y="0" width="36" height="36" fill-opacity="0"/></svg>`;
            title_team_enabled_button.onclick = async () => {
                params.teams[team].enabled = !params.teams[team].enabled;
                localStorage.setItem('__timecode_parameters', JSON.stringify(params));
                await createPanel();
            };

            // Title team expand - button
            const title_team_expand_button = document.createElement('button');
            title_team_inline.appendChild(title_team_expand_button);
            title_team_expand_button.setAttribute('class', 'btn form-input is-link');
            title_team_expand_button.setAttribute('type', 'button');
            title_team_expand_button.setAttribute('style', 'border: solid 1px var(--input-border); border-radius: 5px; max-width: 274px;' + (
                params.teams[team].expanded ? ' background-color: #242424;' : '') + (
                !params.teams[team].enabled ? ' color: #707070': ''));
            title_team_expand_button.innerText = params.teams[team].display_name ?? params.teams[team].name;
            title_team_expand_button.onclick = async () => {
                params.teams[team].expanded = !params.teams[team].expanded;
                localStorage.setItem('__timecode_parameters', JSON.stringify(params));
                await createPanel();
            };

            // Title team edit - button
            const title_team_edit_button = document.createElement('button');
            title_team_inline.appendChild(title_team_edit_button);
            title_team_edit_button.setAttribute('class', 'btn is-icon');
            title_team_edit_button.setAttribute('type', 'button');
            title_team_edit_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none"><path d="M12 20H20.5M18 10L21 7L17 3L14 6M18 10L8 20H4V16L14 6M18 10L14 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            title_team_edit_button.onclick = async () => {

                // Fetch popup root - div
                const popup_root = document.getElementsByClassName('popup-root')[0];
        
                {
                    // Popup is hidden - div
                    const popup_container = document.createElement('div');
                    popup_root.lastChild.after(popup_container);
                    popup_container.setAttribute('class', 'popup is-hidden');
                    popup_container.setAttribute('data-size', 'x5');
                    popup_container.setAttribute('data-type', 'default');
        
                    {
                        // Popup overlay - div
                        const popup_overlay = document.createElement('div');
                        popup_container.appendChild(popup_overlay);
                        popup_overlay.setAttribute('class', 'popup-overlay');
                        
                        // Popup inner - div
                        const popup_inner = document.createElement('div');
                        popup_container.appendChild(popup_inner);
                        popup_inner.setAttribute('class', 'popup__inner');
        
                        {
                            // Popup content - div
                            const popup_content = document.createElement('div');
                            popup_inner.appendChild(popup_content);
                            popup_content.setAttribute('class', 'popup__content scrollable');
                            popup_content.setAttribute('role', 'dialog');
                            popup_content.setAttribute('aria-modal', 'true');
                            popup_content.setAttribute('tabindex', '-1');
                            popup_content.setAttribute('style', 'max-width: 400px;');
        
                            {
                                // Popup close - button
                                const popup_close_button = document.createElement('button');
                                popup_content.appendChild(popup_close_button);
                                popup_close_button.setAttribute('class', 'btn is-plain is-icon is-rounded size-sm popup-close');
                                popup_close_button.setAttribute('type', 'button');
                                popup_close_button.innerHTML = `<svg class="svg-inline--fa fa-xmark" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path class="" fill="currentColor" d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"></path></svg>`;
                                popup_close_button.onclick = () => {
                                    popup_root.removeChild(popup_container);
                                }
        
                                // Popup header - div
                                const popup_header = document.createElement('div');
                                popup_content.appendChild(popup_header);
                                popup_header.setAttribute('class', 'popup-header');
                                popup_header.innerHTML = `<div class="popup-header__title">Редактирование команды</div>`;
        
                                // Popup body - div
                                const popup_body = document.createElement('div');
                                popup_content.appendChild(popup_body);
                                popup_body.setAttribute('class', 'popup-body');
                                
                                {

                                    // Form group offset - div
                                    const popup_form_offset = document.createElement('div');
                                    popup_body.appendChild(popup_form_offset);
                                    popup_form_offset.setAttribute('class', 'form-group _offset');
        
                                    {
                                        // Form group offset label - div
                                        const popup_form_offset_label = document.createElement('div');
                                        popup_form_offset.appendChild(popup_form_offset_label);
                                        popup_form_offset_label.setAttribute('class', 'form-label');
                                        popup_form_offset_label.innerHTML = `<span>Отображаемое название</span>`;
        
                                        // Form group offset input - div
                                        const popup_form_offset_input = document.createElement('div');
                                        popup_form_offset.appendChild(popup_form_offset_input);
                                        popup_form_offset_input.setAttribute('class', 'form-input');
        
                                        {
                                            // Form group offset input - input
                                            const popup_form_input = document.createElement('input');
                                            popup_form_offset_input.appendChild(popup_form_input);
                                            popup_form_input.setAttribute('class', 'form-input__field');
                                            popup_form_input.setAttribute('placeholder', 'Введите название');
                                            popup_form_input.value = params.teams[team].display_name ?? '';
                                        }
                                    }
        
                                    // Form button - button
                                    const popup_form_button = document.createElement('button');
                                    popup_body.appendChild(popup_form_button);
                                    popup_form_button.setAttribute('class', 'btn is-filled is-full-width variant-primary size-lg');
                                    popup_form_button.setAttribute('type', 'button');
                                    popup_form_button.innerText = 'Сохранить название';
                                    popup_form_button.onclick = async () => {
                                        params.teams[team].display_name = popup_form_offset.lastChild.firstChild.value;
                                        localStorage.setItem('__timecode_parameters', JSON.stringify(params));
                                        if (document.getElementsByClassName('_team_parameters')) await createPanel();
                                        popup_root.removeChild(popup_container);
                                    };
                                }
                            }
                        }
                    }
                }
            };

            // Title team remove - button
            const title_team_remove_button = document.createElement('button');
            title_team_inline.appendChild(title_team_remove_button);
            title_team_remove_button.setAttribute('class', 'btn is-icon variant-danger');
            title_team_remove_button.setAttribute('type', 'button');
            title_team_remove_button.innerHTML = `<svg class="svg-inline--fa fa-trash-can" aria-hidden="true" focusable="false" data-prefix="far" data-icon="trash-can" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path class="" fill="currentColor" d="M160 400C160 408.8 152.8 416 144 416C135.2 416 128 408.8 128 400V192C128 183.2 135.2 176 144 176C152.8 176 160 183.2 160 192V400zM240 400C240 408.8 232.8 416 224 416C215.2 416 208 408.8 208 400V192C208 183.2 215.2 176 224 176C232.8 176 240 183.2 240 192V400zM320 400C320 408.8 312.8 416 304 416C295.2 416 288 408.8 288 400V192C288 183.2 295.2 176 304 176C312.8 176 320 183.2 320 192V400zM317.5 24.94L354.2 80H424C437.3 80 448 90.75 448 104C448 117.3 437.3 128 424 128H416V432C416 476.2 380.2 512 336 512H112C67.82 512 32 476.2 32 432V128H24C10.75 128 0 117.3 0 104C0 90.75 10.75 80 24 80H93.82L130.5 24.94C140.9 9.357 158.4 0 177.1 0H270.9C289.6 0 307.1 9.358 317.5 24.94H317.5zM151.5 80H296.5L277.5 51.56C276 49.34 273.5 48 270.9 48H177.1C174.5 48 171.1 49.34 170.5 51.56L151.5 80zM80 432C80 449.7 94.33 464 112 464H336C353.7 464 368 449.7 368 432V128H80V432z"></path></svg>`;
            title_team_remove_button.onclick = async () => {
                params.teams.splice(team, 1);
                localStorage.setItem('__timecode_parameters', JSON.stringify(params));
                await createPanel();
            };
        }

        if (params.teams[team].expanded) {
            // For all timecodes
            for (let timecode = 0; timecode < params.teams[team].data.timecode.length; timecode++) {

                // Timecode inline - div
                const timecode_inline = document.createElement('div');
                main_container.appendChild(timecode_inline);
                timecode_inline.setAttribute('class', 'lj_a4 inputs _inline');
                timecode_inline.setAttribute('style', 'margin: 12px 0px;');

                {
                    // Timecode select - div > select
                    const timecode_select_container = document.createElement('div');
                    timecode_inline.appendChild(timecode_select_container);
                    timecode_select_container.setAttribute('class', 'form-input');
                    timecode_select_container.setAttribute('inputmode', 'numeric');
                    timecode_select_container.setAttribute('style', 'min-width: 100px');

                    {
                        // Timecode select - select
                        const timecode_select = document.createElement('select');
                        timecode_select_container.appendChild(timecode_select);
                        timecode_select.setAttribute('class', 'form-input__field');
                        let _get_options = type => `value="${type}"` + (type == params.teams[team].data.timecode[timecode].type ? ' selected="selected"' : '');
                        timecode_select.innerHTML = `
                            <option ${_get_options('opening')}>Опенинг</option>
                            <option ${_get_options('ending')}>Эндинг</option>
                            <option ${_get_options('ost')}>OST</option>
                            <option ${_get_options('compilation')}>Компиляция</option>
                            <option ${_get_options('splashScreen')}>Заставка</option>`;
                        timecode_select.onchange = async () => {
                            params.teams[team].data.timecode[timecode].type = timecode_select.value;
                            localStorage.setItem('__timecode_parameters', JSON.stringify(params));
                            await createPanel();
                        };
                    }

                    // Timecode form cantainer - div > div > input
                    const timecode_form_container = document.createElement('div');
                    timecode_inline.appendChild(timecode_form_container);
                    timecode_form_container.setAttribute('class', 'inputs _inline _group');

                    for (let value of ['От', 'До']) {
                        // Timecode form - div > input
                        const timecode_form = document.createElement('div');
                        timecode_form_container.appendChild(timecode_form);
                        timecode_form.setAttribute('class', 'form-input');

                        {
                            // Timecode form - input
                            const timecode_input = document.createElement('input');
                            timecode_form.appendChild(timecode_input);
                            timecode_input.setAttribute('class', 'form-input__field');
                            timecode_input.setAttribute('type', 'text');
                            timecode_input.setAttribute('inputmode', 'numeric');
                            timecode_input.setAttribute('placeholder', value);
                            timecode_input.value = (value == 'От' ? params.teams[team].data.timecode[timecode].from : params.teams[team].data.timecode[timecode].to);
                            timecode_input.onchange = () => {
                                if (value == 'От') params.teams[team].data.timecode[timecode].from = timecode_input.value;
                                else params.teams[team].data.timecode[timecode].to = timecode_input.value;
                                localStorage.setItem('__timecode_parameters', JSON.stringify(params));
                            };
                        }
                    }

                    // Timecode remove - button
                    const timecode_remove_button = document.createElement('button');
                    timecode_inline.appendChild(timecode_remove_button);
                    timecode_remove_button.setAttribute('class', 'btn is-icon variant-danger');
                    timecode_remove_button.setAttribute('type', 'button');
                    timecode_remove_button.innerHTML = `<svg class="svg-inline--fa fa-trash-can" aria-hidden="true" focusable="false" data-prefix="far" data-icon="trash-can" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path class="" fill="currentColor" d="M160 400C160 408.8 152.8 416 144 416C135.2 416 128 408.8 128 400V192C128 183.2 135.2 176 144 176C152.8 176 160 183.2 160 192V400zM240 400C240 408.8 232.8 416 224 416C215.2 416 208 408.8 208 400V192C208 183.2 215.2 176 224 176C232.8 176 240 183.2 240 192V400zM320 400C320 408.8 312.8 416 304 416C295.2 416 288 408.8 288 400V192C288 183.2 295.2 176 304 176C312.8 176 320 183.2 320 192V400zM317.5 24.94L354.2 80H424C437.3 80 448 90.75 448 104C448 117.3 437.3 128 424 128H416V432C416 476.2 380.2 512 336 512H112C67.82 512 32 476.2 32 432V128H24C10.75 128 0 117.3 0 104C0 90.75 10.75 80 24 80H93.82L130.5 24.94C140.9 9.357 158.4 0 177.1 0H270.9C289.6 0 307.1 9.358 317.5 24.94H317.5zM151.5 80H296.5L277.5 51.56C276 49.34 273.5 48 270.9 48H177.1C174.5 48 171.1 49.34 170.5 51.56L151.5 80zM80 432C80 449.7 94.33 464 112 464H336C353.7 464 368 449.7 368 432V128H80V432z"></path></svg>`;
                    timecode_remove_button.onclick = async () => {
                        params.teams[team].data.timecode.splice(timecode, 1);
                        localStorage.setItem('__timecode_parameters', JSON.stringify(params));
                        await createPanel();
                    }
                }
            }
            
            // Adding timecode - button
            const adding_timecode_button = document.createElement('button');
            main_container.appendChild(adding_timecode_button);
            adding_timecode_button.setAttribute('class', 'btn is-full-width');
            adding_timecode_button.setAttribute('type', 'button');
            adding_timecode_button.innerHTML = `
            <svg class="svg-inline--fa fa-plus" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path class="" fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
            <span>Добавить тайм-код</span>`;
            adding_timecode_button.onclick = async () => {
                params.teams[team].data.timecode.push({'type': 'opening', 'from': '', 'to': ''});
                localStorage.setItem('__timecode_parameters', JSON.stringify(params));
                await createPanel();
            };

            // Settings timecode inline - div
            const settings_timecode_inline = document.createElement('div');
            main_container.appendChild(settings_timecode_inline);
            settings_timecode_inline.setAttribute('class', 'lj_a4 inputs _inline');
            settings_timecode_inline.setAttribute('style', 'margin: 12px 0px;')

            {
                // Settings detail timecode - button
                const settings_detail_button = document.createElement('button');
                settings_timecode_inline.appendChild(settings_detail_button);
                settings_detail_button.setAttribute('class', 'btn is-link');
                settings_detail_button.setAttribute('type', 'button');
                settings_detail_button.setAttribute('style', 'border: solid 1px var(--input-border); border-radius: 5px; padding: 0px 12px;' + (
                    params.teams[team].data.changes.details.enabled ? ' background-color: #242424;' : ''));
                settings_detail_button.innerText = 'Детальная настройка';
                settings_detail_button.onclick = async () => {
                    // team.data.changes.details.enabled = !team.data.changes.details.enabled;
                    // params.teams[i].expanded = !team.expanded;
                    // localStorage.setItem('__timecode_parameters', JSON.stringify(params));
                    // await createPanel();
                }

                // Settings adder form container - div > [div > field] + [div >  input]
                const settings_adder_form_container = document.createElement('div');
                settings_timecode_inline.appendChild(settings_adder_form_container);
                settings_adder_form_container.setAttribute('class', 'inputs _inline _group');

                {
                    // Settings adder field - div
                    const settings_adder_field = document.createElement('div');
                    settings_adder_form_container.appendChild(settings_adder_field);
                    settings_adder_field.setAttribute('class', 'form-input');
                    settings_adder_field.setAttribute('style', 'min-width: 100px;');
                    settings_adder_field.innerHTML = `<div class="form-input__field" style="padding: 5px 12px;">+ Секунд</div>`;

                    // Settings adder form container - div
                    const settings_adder_form = document.createElement('div');
                    settings_adder_form_container.appendChild(settings_adder_form);
                    settings_adder_form.setAttribute('class', 'form-input');

                    {
                        // Settings adder input - input
                        const settings_adder_input = document.createElement('input');
                        settings_adder_form.appendChild(settings_adder_input);
                        settings_adder_input.setAttribute('class', 'form-input__field');
                        settings_adder_input.setAttribute('type', 'text');
                        settings_adder_input.setAttribute('inputmode', 'numeric');
                        // _adding_input.setAttribute('style', 'max-width: 40px;');
                        settings_adder_input.value = `${params.teams[team].data.changes.add}`;
                        settings_adder_input.onchange = () => {
                            if (!isNaN(+settings_adder_input.value)) {
                                params.teams[team].data.changes.add = +settings_adder_input.value;
                            }
                            localStorage.setItem('__timecode_parameters', JSON.stringify(params));
                        }
                    }
                }

                // Settings adder reset - button
                const settigs_adder_reset_button = document.createElement('button');
                settings_timecode_inline.appendChild(settigs_adder_reset_button);
                settigs_adder_reset_button.setAttribute('class', 'btn is-icon variant-danger');
                settigs_adder_reset_button.setAttribute('type', 'button');
                settigs_adder_reset_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 25 25" fill="none"><path d="M4.56189 13.5L4.14285 13.9294L4.5724 14.3486L4.99144 13.9189L4.56189 13.5ZM9.92427 15.9243L15.9243 9.92427L15.0757 9.07574L9.07574 15.0757L9.92427 15.9243ZM9.07574 9.92426L15.0757 15.9243L15.9243 15.0757L9.92426 9.07574L9.07574 9.92426ZM19.9 12.5C19.9 16.5869 16.5869 19.9 12.5 19.9V21.1C17.2496 21.1 21.1 17.2496 21.1 12.5H19.9ZM5.1 12.5C5.1 8.41309 8.41309 5.1 12.5 5.1V3.9C7.75035 3.9 3.9 7.75035 3.9 12.5H5.1ZM12.5 5.1C16.5869 5.1 19.9 8.41309 19.9 12.5H21.1C21.1 7.75035 17.2496 3.9 12.5 3.9V5.1ZM5.15728 13.4258C5.1195 13.1227 5.1 12.8138 5.1 12.5H3.9C3.9 12.8635 3.92259 13.2221 3.9665 13.5742L5.15728 13.4258ZM12.5 19.9C9.9571 19.9 7.71347 18.6179 6.38048 16.6621L5.38888 17.3379C6.93584 19.6076 9.54355 21.1 12.5 21.1V19.9ZM4.99144 13.9189L7.42955 11.4189L6.57045 10.5811L4.13235 13.0811L4.99144 13.9189ZM4.98094 13.0706L2.41905 10.5706L1.58095 11.4294L4.14285 13.9294L4.98094 13.0706Z" fill="currentColor"/></svg>`;
                settigs_adder_reset_button.onclick = async () => {
                    params.teams[team].data.changes.add = 0;
                    localStorage.setItem('__timecode_parameters', JSON.stringify(params));
                    await createPanel();
                };
            }
        }
    }
    
    // New team - button
    const new_team_button = document.createElement('button');
    main_container.appendChild(new_team_button);
    new_team_button.setAttribute('class', 'btn is-full-width');
    new_team_button.setAttribute('type', 'button');
    new_team_button.setAttribute('style', 'margin: 12px 0px;')
    new_team_button.innerHTML = `
    <svg class="svg-inline--fa fa-plus" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path class="" fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
    <span>Добавить настройку</span>`;
    new_team_button.onclick = async () => {

        // Fetch popup root - div
        const popup_root = document.getElementsByClassName('popup-root')[0];

        {
            // Popup is hidden - div
            const popup_container = document.createElement('div');
            popup_root.lastChild.after(popup_container);
            popup_container.setAttribute('class', 'popup is-hidden');
            popup_container.setAttribute('data-size', 'x5');
            popup_container.setAttribute('data-type', 'default');

            {
                // Popup overlay - div
                const popup_overlay = document.createElement('div');
                popup_container.appendChild(popup_overlay);
                popup_overlay.setAttribute('class', 'popup-overlay');
                
                // Popup inner - div
                const popup_inner = document.createElement('div');
                popup_container.appendChild(popup_inner);
                popup_inner.setAttribute('class', 'popup__inner');

                {
                    // Popup content - div
                    const popup_content = document.createElement('div');
                    popup_inner.appendChild(popup_content);
                    popup_content.setAttribute('class', 'popup__content scrollable');
                    popup_content.setAttribute('role', 'dialog');
                    popup_content.setAttribute('aria-modal', 'true');
                    popup_content.setAttribute('tabindex', '-1');
                    popup_content.setAttribute('style', 'max-width: 400px;');

                    {
                        // Popup close - button
                        const popup_close_button = document.createElement('button');
                        popup_content.appendChild(popup_close_button);
                        popup_close_button.setAttribute('class', 'btn is-plain is-icon is-rounded size-sm popup-close');
                        popup_close_button.setAttribute('type', 'button');
                        popup_close_button.innerHTML = `<svg class="svg-inline--fa fa-xmark" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path class="" fill="currentColor" d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"></path></svg>`;
                        popup_close_button.onclick = () => {
                            popup_root.removeChild(popup_container);
                        }

                        // Popup header - div
                        const popup_header = document.createElement('div');
                        popup_content.appendChild(popup_header);
                        popup_header.setAttribute('class', 'popup-header');
                        popup_header.innerHTML = `<div class="popup-header__title">Выбор команды</div>`;

                        // Popup body - div
                        const popup_body = document.createElement('div');
                        popup_content.appendChild(popup_body);
                        popup_body.setAttribute('class', 'popup-body');
                        
                        {
                            // Form group - div
                            const popup_form_group = document.createElement('div');
                            popup_body.appendChild(popup_form_group);
                            popup_form_group.setAttribute('class', 'form-group');
                            popup_form_group.setAttribute('style', 'padding-bottom: 8px;');

                            {
                                // Form label - div
                                const popup_form_group_label = document.createElement('div');
                                popup_form_group.appendChild(popup_form_group_label);
                                popup_form_group_label.setAttribute('class', 'form-label');
                                popup_form_group_label.innerText = 'Команда';
                            }

                            const anime_id = document.URL.split('https://anilib.me/ru/anime/')[1].split('/')[0];
                            const teams = await (await fetch(`https://api.lib.social/api/anime/${anime_id}?fields[]=teams`)).json();
                            for (let team_form = 0; team_form < teams.data.teams.length; team_form++) {

                                // Form team label - label
                                const form_team_label = document.createElement('label');
                                popup_form_group.appendChild(form_team_label);
                                form_team_label.setAttribute('class', 'control');

                                {
                                    // Form team input - input
                                    const form_team_input = document.createElement('input');
                                    form_team_label.appendChild(form_team_input);
                                    form_team_input.setAttribute('class', 'control__input __web-inspector-hide-shortcut__');
                                    form_team_input.setAttribute('type', 'radio');
                                    form_team_input.setAttribute('name', 'team_select');
                                    form_team_input.setAttribute('value', `${teams.data.teams[team_form].id}`);
                                    form_team_input.onchange = () => {
                                        popup_form_offset.lastChild.firstChild.value = teams.data.teams.find(
                                            team => team.id == document.querySelector('input[name="team_select"]:checked').value).name;
                                    };

                                    // Form team indicator - span
                                    const form_team_indicator = document.createElement('span');
                                    form_team_label.appendChild(form_team_indicator);
                                    form_team_indicator.setAttribute('class', 'control__indicator');
                                    form_team_indicator.setAttribute('data-type', 'radio');
                                    form_team_indicator.innerHTML = `
                                    <svg class="svg-inline--fa fa-circle-dot fa-fw" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-dot" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-state="checked"><path class="" fill="currentColor" d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zm0-160c-53 0-96-43-96-96s43-96 96-96s96 43 96 96s-43 96-96 96z"></path></svg>
                                    <svg class="svg-inline--fa fa-circle fa-fw" aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-state="default"><path class="" fill="currentColor" d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"></path></svg>`;

                                    // Form team text - span
                                    const form_team_text = document.createElement('span');
                                    form_team_label.appendChild(form_team_text);
                                    form_team_text.setAttribute('class', 'control__text');
                                    form_team_text.innerHTML = `<span>${teams.data.teams[team_form].name}</span>`
                                }
                            }

                            // Form group offset - div
                            const popup_form_offset = document.createElement('div');
                            popup_body.appendChild(popup_form_offset);
                            popup_form_offset.setAttribute('class', 'form-group _offset');
                            popup_form_offset.setAttribute('style', 'padding-top: 8px;');

                            {
                                // Form group offset label - div
                                const popup_form_offset_label = document.createElement('div');
                                popup_form_offset.appendChild(popup_form_offset_label);
                                popup_form_offset_label.setAttribute('class', 'form-label');
                                popup_form_offset_label.innerHTML = `<span>Отображаемое название</span>`;

                                // Form group offset input - div
                                const popup_form_offset_input = document.createElement('div');
                                popup_form_offset.appendChild(popup_form_offset_input);
                                popup_form_offset_input.setAttribute('class', 'form-input');

                                {
                                    // Form group offset input - input
                                    const popup_form_input = document.createElement('input');
                                    popup_form_offset_input.appendChild(popup_form_input);
                                    popup_form_input.setAttribute('class', 'form-input__field');
                                    popup_form_input.setAttribute('placeholder', 'Выберите команду');
                                }
                            }

                            // Form button - button
                            const popup_form_button = document.createElement('button');
                            popup_body.appendChild(popup_form_button);
                            popup_form_button.setAttribute('class', 'btn is-filled is-full-width variant-primary size-lg');
                            popup_form_button.setAttribute('type', 'button');
                            popup_form_button.innerText = 'Сохранить выбор';
                            popup_form_button.onclick = async () => {
                                const team_id = +document.querySelector('input[name="team_select"]:checked')?.value;
                                if (team_id) {
                                    const team_name = teams.data.teams.find(team => team.id == team_id).name;
                                    const display_name = popup_form_offset.lastChild.firstChild.value;
                                    params.teams.push({
                                        id: team_id,
                                        name: team_name,
                                        display_name,
                                        enabled: true,
                                        expanded: false,
                                        data: {
                                            timecode: [],
                                            changes: {
                                                add: 0,
                                                details: {
                                                    enabled: false,
                                                    timecode: null
                                                }
                                            }
                                        }
                                    });
                                    localStorage.setItem('__timecode_parameters', JSON.stringify(params));
                                    if (document.getElementsByClassName('_team_parameters')) await createPanel();
                                }
                                popup_root.removeChild(popup_container);
                            };
                        }
                    }
                }
            }
        }
    };

    // Main panel - div
    const main_panel = popup_body.lastChild;
    main_panel.lastChild.onclick = async () => {

        function add(time, seconds) {
            const splitted = time.split(':');
            if (splitted.length == 1) {
                seconds += +splitted[0];
            } else if (splitted.length == 2) {
                seconds += +splitted[0] * 60 + +splitted[1];
            } else if (splitted.length == 3) {
                seconds += +splitted[0] * 3600 + +splitted[1] * 60 + +splitted[2];
            } else throw new Error();
            if (seconds < 0) seconds = 0;
            return (seconds >= 3600 ? `${('0' + Math.floor(seconds / 3600)).slice(-2)}:` : '') + `${('0' + Math.floor(seconds / 60)).slice(-2)}:${('0' + seconds % 60).slice(-2)}`;
        }

        const many_episodes = main_panel.children[1].children[0].children[0].children[0].checked;
        const to_episode = main_panel.children[1].children[0].children[1].children[0].value;
        const for_one_team = main_panel.children[2].children[0].children[0].checked;
        const timecodes = [];
        for (let div of popup_body.children) {
            if (div.tagName != 'DIV') break;
            timecodes.push({
                type: div.children[0].children[0].value,
                from: div.children[1].children[0].children[0].value,
                to: div.children[1].children[1].children[0].value
            })
        }

        const bearer_token = JSON.parse(localStorage.getItem('auth'))?.token?.access_token;
        const anime_id = document.URL.split('https://anilib.me/ru/anime/')[1].split('/')[0];
        const episode_id = document.URL.split(`https://anilib.me/ru/anime/${anime_id}/episodes/`)[1].split('/')[0];
        const player_id = document.URL.split(`https://anilib.me/ru/anime/${anime_id}/episodes/${episode_id}/player/`)[1];
        const teams = JSON.parse(localStorage.getItem('__timecode_parameters')).teams;
        const team_ids = teams.filter(team => team.enabled).map(team => team.id);
        
        if (for_one_team) {

            const response = [];
            for (let timecode of timecodes) {
                response.push(structuredClone(timecode));
                if (timecode.to.startsWith('-')) {
                    let seconds = document.getElementById('video').children[0].duration + +timecode.to;
                    response.at(-1).to = (seconds >= 3600 ? `${('0' + Math.floor(seconds / 3600)).slice(-2)}:` : '') + `${('0' + Math.floor(seconds / 60)).slice(-2)}:${('0' + Math.floor(seconds % 60)).slice(-2)}`
                }
            }
            if (JSON.stringify(timecodes) != JSON.stringify(response)) {
                put_request(player_id, response);
            }

        } else {

            const players = (await (await fetch(`https://api.lib.social/api/episodes/${episode_id}?with_moderated=1`)).json()).data.players.filter(player => player.player == 'Animelib');
            for (let player of players) {
                const response = [];
                for (let timecode of timecodes) {
                    response.push(structuredClone(timecode));
                    if (team_ids.includes(player.team.id)) {
                        const changes_add = teams.find(team => team.id == player.team.id).data.changes.add;
                        response.at(-1).from = add(timecode.from, changes_add);
                        response.at(-1).to = timecode.to.startsWith('-') ? timecode.to : add(timecode.to, changes_add);
                    }
                    if (timecode.to.startsWith('-')) {
                        const video = document.createElement('video');
                        video.setAttribute('src', 'https://video1.anilib.me/.%D0%B0s/' + player.video.quality.at(-1).href);
                        async function onloaded() {
                            return new Promise(resolve => (video.onloadeddata = () => resolve()));
                        };
                        await onloaded();
                        let seconds = video.duration + +timecode.to;
                        response.at(-1).to = (seconds >= 3600 ? `${('0' + Math.floor(seconds / 3600)).slice(-2)}:` : '') + `${('0' + Math.floor(seconds / 60)).slice(-2)}:${('0' + Math.floor(seconds % 60)).slice(-2)}`
                    }
                }
                if (JSON.stringify(timecodes) != JSON.stringify(response)) {
                    put_request(player.id, response);
                }
            }

        }

        function put_request(player_id, timecodes) {
            const body = {timecode: timecodes};
            if (many_episodes) {
                body.applyTimcodesUntilEpisode = +to_episode;
                body.applyTimecodesCurrentTeam = true;
            }
            fetch(`https://api.lib.social/api/players/${player_id}/timecodes`, {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: {
                    'Authorization': `Bearer ${bearer_token}`,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0',
                    'Access-Control-Allow-Origin': 'https://anilib.me',
                    'Access-Control-Allow-Credentials': 'true',
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive'
                }
            });
        }
    };
}


async function run_timecode_event() {
    if (!/https:\/\/anilib\.me\/ru\/anime\/\d{1,6}--[a-z-]{1,50}\/episodes\/\d{1,8}\/player\/\d{1,8}/g.exec(document.URL)) return;
    const root = document.getElementsByClassName('popup-root')[0];
    if (!root) return;
    const observer = new MutationObserver(async el => {
        if (el[0].addedNodes.length && !el[0].previousSibling.childNodes.length) await createPanel()
    });
    observer.observe(root, { childList: true });
    

    // if (0) {
    //     const body = document.getElementsByClassName('popup-body')?.[0];
    //     if (!body) return;
    //     body.insertAdjacentElement(body.children.length - 2, createPanel());
    //     const bearer_token = JSON.parse(localStorage.getItem('auth'))?.token?.access_token;
    //     if (!bearer_token) return console.error('Auth is request');
    //     const anime_id = document.URL.split('https://anilib.me/ru/anime/')[1].split('/')[0];
    //     const episode_id = document.URL.split(`https://anilib.me/ru/anime/${anime_id}/episodes/`)[1];
    //     const episodes = await (await fetch(`https://api.lib.social/api/episodes?anime_id=${anime_id}`)).json();
    //     const teams = await (await fetch(`https://api.lib.social/api/anime/${anime_id}?fields[]=teams`)).json();
    //     const players = await (await fetch(`https://api.lib.social/api/episodes/${episode_id}?with_moderated=1`)).json();
    // }
}


async function run() {
    await run_timecode_event();
}


(async () => {
    if (document.readyState != 'loading') await run();
    else document.addEventListener('DOMContentLoaded', run);
})()
